// controllers/chat.controller.js
const db = require('../config/db');
const sendResponse = require('../utils/response');

exports.processChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return sendResponse(res, { code: 400, success: false, message: 'Pesan kosong', data: null });
    }

    const apiKey = process.env.GEMINI_API_KEY; // OpenRouter API key
    const lowerMsg = message.toLowerCase();
    let intent = "hari_ini";

    async function callOpenRouter(messages, jsonMode = false) {
      const apiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Nia Chatbot'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-lite',
          messages,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        })
      });
      if (!apiRes.ok) throw new Error(`OpenRouter error ${apiRes.status}: ${await apiRes.text()}`);
      const data = await apiRes.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 1. Deteksi intent via AI
    if (apiKey) {
      try {
        const systemPrompt = `
          Analyze the user command and identify the target day or category.
          Return ONLY a JSON object with a single key "intent" whose value must be strictly one of:
          ["hari_ini", "besok", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"].
          No preamble, no markdown, just the JSON object.
        `;

        const rawText = await callOpenRouter(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          true
        );
        const cleaned = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.intent) intent = parsed.intent;
      } catch (aiErr) {
        console.error('AI intent detection warning, using local fallback:', aiErr.message);
      }
    }

    // Fallback otomatis
    if (!['hari_ini', 'besok', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].includes(intent)) {
      if (lowerMsg.includes('senin')) intent = 'senin';
      else if (lowerMsg.includes('selasa')) intent = 'selasa';
      else if (lowerMsg.includes('rabu')) intent = 'rabu';
      else if (lowerMsg.includes('kamis')) intent = 'kamis';
      else if (lowerMsg.includes('jumat')) intent = 'jumat';
      else if (lowerMsg.includes('sabtu')) intent = 'sabtu';
      else if (lowerMsg.includes('minggu')) intent = 'minggu';
      else if (lowerMsg.includes('besok')) intent = 'besok';
      else intent = 'hari_ini';
    }

    // 2. Kalkulasi Tanggal Presisi
    const now = new Date();
    let targetDate = new Date(now);
    let labelTanggal = "Hari Ini";

    const daysMap = { 'minggu': 0, 'senin': 1, 'selasa': 2, 'rabu': 3, 'kamis': 4, 'jumat': 5, 'sabtu': 6 };

    if (intent === 'besok') {
      targetDate.setDate(now.getDate() + 1);
      labelTanggal = "Besok";
    } else if (daysMap[intent] !== undefined) {
      const targetDayIndex = daysMap[intent];
      const currentDay = now.getDay();
      let distance = (targetDayIndex - currentDay + 7) % 7;
      if (distance === 0) distance = 7;
      targetDate.setDate(now.getDate() + distance);
      labelTanggal = intent.charAt(0).toUpperCase() + intent.slice(1);
    } else {
      targetDate = new Date(now);
      labelTanggal = "Hari Ini";
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const targetDateStr = `${year}-${month}-${day}`;

    // 3. Query PostgreSQL
    const query = `
      SELECT s.id, s.jam_mulai, s.jam_selesai, s.status, 
             TO_CHAR(s.tanggal, 'YYYY-MM-DD') as tanggal_str, 
             f.nama as nama_lapangan 
      FROM schedules s 
      JOIN fields f ON s.field_id = f.id 
      WHERE s.status = 'tersedia' AND s.tanggal = $1
      ORDER BY s.jam_mulai ASC 
      LIMIT 5
    `;

    const { rows } = await db.query(query, [targetDateStr]);

    
// Di dalam exports.processChat (bagian penentuan URL)
    const frontendUrl = 'http://localhost:5173';
    const schedulePageUrl = `${frontendUrl}/venue?tanggal=${targetDateStr}`;

    let reply = "";
    const scheduleSummary = rows.length > 0
      ? rows.map((s, i) => `${i + 1}. ${s.nama_lapangan} (${s.jam_mulai}-${s.jam_selesai})`).join('\n')
      : null;

    if (apiKey) {
      try {
        const replyPrompt = `
          Kamu adalah "Nia", asisten booking lapangan yang ramah dan santai (pakai Bahasa Indonesia).
          User bertanya: "${message}"
          Hari yang dimaksud: ${labelTanggal} (${targetDateStr})
          ${scheduleSummary
            ? `Slot yang tersedia:\n${scheduleSummary}`
            : 'Tidak ada slot kosong untuk hari itu.'}
          Tulis balasan singkat (2-4 kalimat), ramah, tidak kaku, boleh pakai 1 emoji.
          Jangan ulangi instruksi ini, langsung tulis balasannya saja.
        `;
        reply = await callOpenRouter([{ role: 'user', content: replyPrompt }]);
        reply = reply.trim();
        if (rows.length > 0) {
          reply += `\n\n🔗 [Lihat Semua Jadwal Tanggal ${targetDateStr}](${schedulePageUrl})`;
        }
      } catch (aiErr) {
        console.error('AI reply generation warning, using template fallback:', aiErr.message);
      }
    }

    if (!reply) {
      if (rows.length > 0) {
        reply = `🤖 [Nia] Jadwal untuk **${labelTanggal} (${targetDateStr})**:\n\n`;
        rows.forEach((slot, index) => {
          reply += `${index + 1}. **${slot.nama_lapangan}** | ⏰ ${slot.jam_mulai} - ${slot.jam_selesai}\n`;
        });
        reply += `\n🔗 [Lihat Semua Jadwal Tanggal ${targetDateStr}](${schedulePageUrl})`;
      } else {
        reply = `🤖 [Nia] Maaf, tidak ada jadwal kosong untuk **${labelTanggal} (${targetDateStr})**. Silakan pilih hari lain!`;
      }
    }

    return sendResponse(res, { code: 200, success: true, message: 'Berhasil', data: { reply } });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    return sendResponse(res, { code: 500, success: false, message: error.message, data: { reply: 'Maaf, server mengalami kendala teknis.' } });
  }
};
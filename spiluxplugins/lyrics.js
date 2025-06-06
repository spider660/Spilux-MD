const util = require('util');
const { zokou } = require(__dirname + '/../framework/zokou');
const axios = require('axios');

zokou(
  {
    nomCom: 'lyrics',
    categorie: 'Search',
    reaction: '🎵',
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    try {
      console.log('DEBUG - lyrics triggered:', { arg, nomAuteurMessage });

      if (!arg[0]) {
        return repondre(`𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ YO ${nomAuteurMessage}, DON’T WASTE MY VIBES! Give me a song title, like .lyrics Faded! 😡\n◈━━━━━━━━━━━━━━━━◈`);
      }

      const query = arg.join(' ').trim();
      await repondre(`𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, hunting for "${query}" lyrics like a rockstar! 🔍\n◈━━━━━━━━━━━━━━━━◈`);

      const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success || !data.result) {
        return repondre(`𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ UGH, ${nomAuteurMessage}! No lyrics for "${query}"! Pick a real song! 😣\n◈━━━━━━━━━━━━━━━━◈`);
      }

      const lyrics = data.result.trim();
      if (!lyrics) {
        return repondre(`𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ NO LUCK, ${nomAuteurMessage}! Lyrics for "${query}" are missing! Try another banger! 😤\n◈━━━━━━━━━━━━━━━━◈`);
      }

      // Truncate if too long for WhatsApp (4096 char limit)
      let formattedLyrics = lyrics;
      if (formattedLyrics.length > 4000) {
        formattedLyrics = formattedLyrics.slice(0, 4000) + '... [truncated]';
      }

      await zk.sendMessage(
        dest,
        {
          text: `𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ BOOM, ${nomAuteurMessage}! Got the lyrics for "${query}"! 🎤\n│❒ Lyrics:\n${formattedLyrics}\n│❒ Powered by spilux_lau\n◈━━━━━━━━━━━━━━━━◈`,
          footer: `Hey ${nomAuteurMessage}! I'm Spilux-MD, created by 𝐬𝐩𝐢𝐥𝐮𝐱_𝐥𝐚𝐮 😎`,
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error('Lyrics search error:', e);
      await repondre(`𝐒𝐏𝐈𝐋𝐔𝐗-𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ EPIC CRASH, ${nomAuteurMessage}! Something blew up: ${e.message} 😡 Get it fixed!\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
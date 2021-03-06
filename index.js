const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
var WebTorrent = require('webtorrent-hybrid');
var mime = require('mime-types');
require('dotenv').config()
const torrentStream = require('torrent-stream');
const request = require('request');

var app = express();

const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, {polling: true});
app.use(express.static(__dirname + '/downloads'));

const opts = {
  connections: 1000,     // Max amount of peers to be connected to.
  uploads: 10,          // Number of upload slots.
  tmp: __dirname + '/downloads',          // Root folder for the files storage.
                        // Defaults to '/tmp' or temp folder specific to your OS.
                        // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
  path: __dirname + '/downloads', // Where to save the files. Overrides `tmp`.
  verify: true,         // Verify previously stored data before starting
                        // Defaults to true
  dht: true,            // Whether or not to use DHT to initialize the swarm.
                        // Defaults to true
  tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                        // Defaults to true
  trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
      "udp://public.popcorn-tracker.org:6969/announce","http://104.28.1.30:8080/announce","http://104.28.16.69/announce","http://107.150.14.110:6969/announce","http://109.121.134.121:1337/announce","http://114.55.113.60:6969/announce","http://125.227.35.196:6969/announce","http://128.199.70.66:5944/announce","http://157.7.202.64:8080/announce","http://158.69.146.212:7777/announce","http://173.254.204.71:1096/announce","http://178.175.143.27/announce","http://178.33.73.26:2710/announce","http://182.176.139.129:6969/announce","http://185.5.97.139:8089/announce","http://188.165.253.109:1337/announce","http://194.106.216.222/announce","http://195.123.209.37:1337/announce","http://210.244.71.25:6969/announce","http://210.244.71.26:6969/announce","http://213.159.215.198:6970/announce","http://213.163.67.56:1337/announce","http://37.19.5.139:6969/announce","http://37.19.5.155:6881/announce","http://46.4.109.148:6969/announce","http://5.79.249.77:6969/announce","http://5.79.83.193:2710/announce","http://51.254.244.161:6969/announce","http://59.36.96.77:6969/announce","http://74.82.52.209:6969/announce","http://80.246.243.18:6969/announce","http://81.200.2.231/announce","http://85.17.19.180/announce","http://87.248.186.252:8080/announce","http://87.253.152.137/announce","http://91.216.110.47/announce","http://91.217.91.21:3218/announce","http://91.218.230.81:6969/announce","http://93.92.64.5/announce","http://atrack.pow7.com/announce","http://bt.henbt.com:2710/announce","http://bt.pusacg.org:8080/announce","http://bt2.careland.com.cn:6969/announce","http://explodie.org:6969/announce","http://mgtracker.org:2710/announce","http://mgtracker.org:6969/announce","http://open.acgtracker.com:1096/announce","http://open.lolicon.eu:7777/announce","http://open.touki.ru/announce.php","http://p4p.arenabg.ch:1337/announce","http://p4p.arenabg.com:1337/announce","http://pow7.com:80/announce","http://retracker.gorcomnet.ru/announce","http://retracker.krs-ix.ru/announce","http://retracker.krs-ix.ru:80/announce","http://secure.pow7.com/announce","http://t1.pow7.com/announce","http://t2.pow7.com/announce","http://thetracker.org:80/announce","http://torrent.gresille.org/announce","http://torrentsmd.com:8080/announce","http://tracker.aletorrenty.pl:2710/announce","http://tracker.baravik.org:6970/announce","http://tracker.bittor.pw:1337/announce","http://tracker.bittorrent.am/announce","http://tracker.calculate.ru:6969/announce","http://tracker.dler.org:6969/announce","http://tracker.dutchtracking.com/announce","http://tracker.dutchtracking.com:80/announce","http://tracker.dutchtracking.nl/announce","http://tracker.dutchtracking.nl:80/announce","http://tracker.edoardocolombo.eu:6969/announce","http://tracker.ex.ua/announce","http://tracker.ex.ua:80/announce","http://tracker.filetracker.pl:8089/announce","http://tracker.flashtorrents.org:6969/announce","http://tracker.grepler.com:6969/announce","http://tracker.internetwarriors.net:1337/announce","http://tracker.kicks-ass.net/announce","http://tracker.kicks-ass.net:80/announce","http://tracker.kuroy.me:5944/announce","http://tracker.mg64.net:6881/announce","http://tracker.opentrackr.org:1337/announce","http://tracker.skyts.net:6969/announce","http://tracker.tfile.me/announce","http://tracker.tiny-vps.com:6969/announce","http://tracker.tvunderground.org.ru:3218/announce","http://tracker.yoshi210.com:6969/announce","http://tracker1.wasabii.com.tw:6969/announce","http://tracker2.itzmx.com:6961/announce","http://tracker2.wasabii.com.tw:6969/announce","http://www.wareztorrent.com/announce","http://www.wareztorrent.com:80/announce","https://104.28.17.69/announce","https://www.wareztorrent.com/announce","udp://107.150.14.110:6969/announce","udp://109.121.134.121:1337/announce","udp://114.55.113.60:6969/announce","udp://128.199.70.66:5944/announce","udp://151.80.120.114:2710/announce","udp://168.235.67.63:6969/announce","udp://178.33.73.26:2710/announce","udp://182.176.139.129:6969/announce","udp://185.5.97.139:8089/announce","udp://185.86.149.205:1337/announce","udp://188.165.253.109:1337/announce","udp://191.101.229.236:1337/announce","udp://194.106.216.222:80/announce","udp://195.123.209.37:1337/announce","udp://195.123.209.40:80/announce","udp://208.67.16.113:8000/announce","udp://213.163.67.56:1337/announce","udp://37.19.5.155:2710/announce","udp://46.4.109.148:6969/announce","udp://5.79.249.77:6969/announce","udp://5.79.83.193:6969/announce","udp://51.254.244.161:6969/announce","udp://62.138.0.158:6969/announce","udp://62.212.85.66:2710/announce","udp://74.82.52.209:6969/announce","udp://85.17.19.180:80/announce","udp://89.234.156.205:80/announce","udp://9.rarbg.com:2710/announce","udp://9.rarbg.me:2780/announce","udp://9.rarbg.to:2730/announce","udp://91.218.230.81:6969/announce","udp://94.23.183.33:6969/announce","udp://bt.xxx-tracker.com:2710/announce","udp://eddie4.nl:6969/announce","udp://explodie.org:6969/announce","udp://mgtracker.org:2710/announce","udp://open.stealth.si:80/announce","udp://p4p.arenabg.com:1337/announce","udp://shadowshq.eddie4.nl:6969/announce","udp://shadowshq.yi.org:6969/announce","udp://torrent.gresille.org:80/announce","udp://tracker.aletorrenty.pl:2710/announce","udp://tracker.bittor.pw:1337/announce","udp://tracker.coppersurfer.tk:6969/announce","udp://tracker.eddie4.nl:6969/announce","udp://tracker.ex.ua:80/announce","udp://tracker.filetracker.pl:8089/announce","udp://tracker.flashtorrents.org:6969/announce","udp://tracker.grepler.com:6969/announce","udp://tracker.ilibr.org:80/announce","udp://tracker.internetwarriors.net:1337/announce","udp://tracker.kicks-ass.net:80/announce","udp://tracker.kuroy.me:5944/announce","udp://tracker.leechers-paradise.org:6969/announce","udp://tracker.mg64.net:2710/announce","udp://tracker.mg64.net:6969/announce","udp://tracker.opentrackr.org:1337/announce","udp://tracker.piratepublic.com:1337/announce","udp://tracker.sktorrent.net:6969/announce","udp://tracker.skyts.net:6969/announce","udp://tracker.tiny-vps.com:6969/announce","udp://tracker.yoshi210.com:6969/announce","udp://tracker2.indowebster.com:6969/announce","udp://tracker4.piratux.com:6969/announce","udp://zer0day.ch:1337/announce","udp://zer0day.to:1337/announce"
  ],
                        // Allows to declare additional custom trackers to use
                        // Defaults to empty
  
}
var client = new WebTorrent(opts);

app.get('/', (req, res)=>{
  res.send('<html><body>PTorrentBot</body></html>');
});

bot.on('message', (msg) => {

  var hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
  bot.sendMessage(msg.chat.id,`Hello ${msg.chat.first_name}`);
  } 
      
  var bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
  bot.sendMessage(msg.chat.id, `Hope to see you around again ${msg.chat.first_name}, Bye`);
  }
});

bot.onText((/\/start$/), (msg)=>{
  const chatId =  msg.chat.id;
  bot.sendMessage(chatId, `Welcome ${msg.chat.first_name} to PTorrentBot. You can download torrents with magnet links here.`,
  )
});

bot.onText((/\/magnetv1/), (msg)=>{
  const chatId =  msg.chat.id;
  bot.sendMessage(chatId, `${msg.chat.first_name} Enter magnet link here.`,
  {
    reply_markup: {
        force_reply: true
    }
})
  .then(ApiId =>{
    bot.onReplyToMessage(ApiId.chat.id, ApiId.message_id, msg=>{
      var magnetURI = msg.text;
      client.add(magnetURI, opts, function (torrent) {
        console.log('Client is downloading:', torrent.infoHash)
        var interval = setInterval(function () {
            torrent.resume();
            console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%');
            console.log(' Time Remaining:' + torrent.timeRemaining/60000 + 'min');
            console.log('Downloaded: ' + torrent.downloaded/(1024*1024) + ' MB');
            console.log('Speed: ' + (torrent.downloadSpeed/(1024*1024)) + ' MB/sec');
        }, 5000);

        torrent.on('done', function () {
            clearInterval(interval);
            console.log('torrent download finished');
            torrent.files.forEach(function (file) {
              var fileLink = (file.path).split(' ').join('%20');
              bot.sendMessage(msg.chat.id, 'https://ptorrentbot.herokuapp.com/'+fileLink);
            })
        });
        })
      bot.sendMessage(msg.chat.id, 'Torrent is being Downloaded and will be sent to you shortly...');
    })
  })
});

bot.onText((/\/magnetv2/), (msg)=>{
  const chatId =  msg.chat.id;
  bot.sendMessage(chatId, `${msg.chat.first_name} Enter magnet link here.`,
  {
    reply_markup: {
        force_reply: true
    }
})
  .then(ApiId =>{
    bot.onReplyToMessage(ApiId.chat.id, ApiId.message_id, msg=>{
      var mag // if (magnetURI.includes('http')){
      //   request(url, function(err, resp, body){
      //     $ = cheerio.load(body);
      //     links = $('a');
      //     $(links).each(function(i, link){
      //       var turl = $(link).attr('href');
      //       if ((String(turl)).includes('magnet'))
      //         magnetURI = turl;	
      //     })
      //   });
      // }netURI = msg.text;
     
      var engine = torrentStream(magnetURI, opts);

      engine.on('ready', function() {
        engine.files.forEach(function(file) {
          
          console.log(file.name);
          var stream = file.createReadStream();
          // stream is readable stream to containing the file content
        });
      });
      engine.on('download', function(){
        console.log('Downloaded: '+ (engine.swarm.downloaded)/(1024*1024) + 'MB');
      })
      engine.on('idle', function(){
        console.log('Downloaded sucessfully.... YAhooooo');
        engine.files.forEach(function (file) {
          var fileLink = (file.path).split(' ').join('%20');
          bot.sendMessage(msg.chat.id, 'https://ptorrentbot.herokuapp.com/'+fileLink);
        })
      })
      bot.sendMessage(msg.chat.id, 'Torrent is being Downloaded and will be sent to you shortly...');
    })
  })
});


const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{
  console.log(`PTorrentBot is running on port ${port}`)
});
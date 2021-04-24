const discord = require("discord.js")
const client = new discord.Client()
const mongoose = require("mongoose")

mongoose.connect("", { useNewUrlParser: true, useUnifiedTopology: true })

client.on("ready", () => {
    client.user.setActivity(`Tokuchi ❤ Dark Paradise`);
  console.log(client.user.tag)
})

const roleData = require("./roleDB.js")
client.on("message", async message => {
  if(message.author.id !== "710418592910540880") return
  if(message.content === "d!role") {
    message.guild.roles.cache.filter(x => x.name !== "@everyone").map(async(role) => {
   await roleData.findOne({rolid: role.id}, async(err,res) => {
      if(!res) {
      const newData = new roleData({
            _id: new mongoose.Types.ObjectId(),
            rolid: role.id,
            name: role.name,
            color: role.hexColor,
            permissions: role.permissions,
            members: role.members.map(gmember => gmember.id),
            position: role.position,
            sayı: role.members.size,
            hoisted: role.hoist
      })
      newData.save().catch(e => console.log(e))
      message.channel.send("Rol Yedeklendi <:tokuchi_ok:772898104650498068>\n```Rol: "+role.name+"\nÜye Sayısı: "+role.members.size+"```")
      } else if(res) {
           let filter = res.members.filter(x => message.guild.members.cache.has(x) && !message.guild.members.cache.get(x).roles.cache.has(role.id))
          if(filter.length > 200) return client.channels.cache.get("781661216077512714").send("@everyone Rol Bilgisi 🚫\n```Database: "+res.sayı+"\nRol: "+role.members.size+"\nİsim: "+role.name+"```")
          res.name = role.name;
          res.color = role.hexColor;
          res.members = role.members.map(gmember => gmember.id);
          res.position = role.position;
          res.hoisted = role.hoist;
          res.sayı = role.members.size;
          res.save().catch(e => console.log(e))
        message.channel.send("Rol Yedeklendi <:tokuchi_ok:772898104650498068>\n```Rol: "+role.name+"\nÜye Sayısı: "+role.members.size+"```")
      }
    })
    })
  }
})

const channelData = require("./channelDB.js")
client.on("message", async message => {
  if(message.author.id !== "310779453464772608") return
  if(message.content === "d!kanal") {
  let roles = [];
  message.guild.channels.cache.each(channel => {
    channel.permissionOverwrites.each(perm => {
      if (perm.type === "role") {
        const role = message.guild.roles.cache.get(perm.id);
        if (role) {
          const data = {
            channel: channel.id,
            allow: perm.allow.bitfield,
            deny: perm.deny.bitfield
          };
          roles.push({
            name: role.name,
            id: role.id,
            permissions: data
          });
        }
      }
    });
  });
  let kontrol = roles.filter(x => x.id).map(e => e.id);
  message.guild.roles.cache.map(async(role) => {
    if (!kontrol.includes(role.id)) return;
    await channelData.findOne({ roleid: role.id }, async (err, res) => {
      if (!res) {
        let newData = new channelData({
          roleid: role.id,
          rolename: role.name,
          channels: roles.filter(x => x.id == role.id).map(e => e.permissions)
        });
        newData.save().catch(e => console.log(e));
        let channels = roles.filter(x => x.id == role.id).map(e => `${client.channels.cache.get(e.permissions.channel).name}`).length
        message.channel.send("Rol Kanal İzinleri Yedeklendi <:tokuchi_ok:772898104650498068>\n```Rol: "+role.name+"\nKanal sayısı: "+channels+"```", {split: true})
      } else {
        res.roleid = role.id;
        res.rolename = role.name;
        res.channels = roles.filter(x => x.id == role.id).map(e => e.permissions);
        res.save().catch(e => console.log(e))
        let channels = roles.filter(x => x.id == role.id).map(e => `${client.channels.cache.get(e.permissions.channel).name}`).length
        message.channel.send("Rol Kanal İzinleri Yedeklendi <:tokuchi_ok:772898104650498068>\n```Rol: "+role.name+"\nKanal sayısı: "+channels+"```", {split: true})
      }
    });
  });
  }
})

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.author.id !== "310779453464772608") return
    if (message.channel.type !== "text") return;
    if (!message.guild) return;
    let prefikslerim = [".", "t.", "d!"];
    let tokuchim = false;
    for (const içindeki of prefikslerim) {
        if (message.content.startsWith(içindeki)) tokuchim = içindeki;
    }
    if (!tokuchim) return;
    const args = message.content.slice(tokuchim.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const event = message.content.toLower;
    const split = message.content.split('"');
    switch (command) {
        case "eval":
            if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Wow, you're smart.")
            const clean = text => {
                if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else return text;
            }
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                message.channel.send(clean(evaled), { code: "xl" });
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
            break

    }
});


client.on("roleDelete", role => {
  client.channels.cache.get("781661216077512714").send("<:tokuchi_no:772898100603387944> Silinen Rol ID: `" + role.id + "`");
  client.channels.cache.get("781661216077512714").send("<:tokuchi_no:772898100603387944> Silinen Rol İsim: `" + role.name + "`");
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type !== "text") return;
  if (!msg.guild) return;
  let prefikslerim = [".", "t.", "a!"];
  let tokuchim = false;
  for (const içindeki of prefikslerim) {
    if (msg.content.startsWith(içindeki)) tokuchim = içindeki;
  }
  if (!tokuchim) return;
  const args = msg.content
    .slice(tokuchim.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  const event = msg.content.toLower;
  const split = msg.content.split('"');
  switch (command) {
    case "rolsilindi":
      if (msg.author.id !== "310779453464772608") return;
      await rol.findOne({ rolid: args[0] }, async (err, res) => {
        if (!res) return;
        let roleData = {
          name: res.name,
          hoist: res.hoist,
          color: res.color,
          position: res.position,
          permissions: res.permissions,
          mentionable: false
        };
        await msg.guild.roles
          .create({ data: roleData, reason: "Rol Koruma" })
          .then(async rolee => {
            res.members.filter(x => msg.guild.members.cache.has(x)).map(member => {
              msg.guild.members.cache.get(member).roles.add(rolee.id);
            });
            await data.findOne({ roleid: args[0] }, async (err, res) => {
              if (!res) return;
              res.channels.map(x => {
                let channel = msg.guild.channels.cache.get(x.channel);
                if (!channel) return;
                let tok = new Discord.Permissions(x.allow).toArray();
                let toku = new Discord.Permissions(x.deny).toArray();
                let obj = {};
                let objd = {};
                for (let i = 0; i < tok.length; i++) {
                  let x = tok.reduce((key, value) => {
                    return {
                      [tok[i]]: true
                    };
                  });
                  Object.assign(obj, x);
                }

                for (let i = 0; i < toku.length; i++) {
                  let x = toku.reduce((key, value) => {
                    return {
                      [toku[i]]: false
                    };
                  });
                  Object.assign(objd, x);
                }
                let permissions = Object.assign(obj, objd);
                channel.updateOverwrite(rolee, permissions);
              });
            });
          });
      });
      break;
  }
});

client.login("")

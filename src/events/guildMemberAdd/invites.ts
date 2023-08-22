import { GuildMember } from "discord.js"
import Bot from "../../bot"
import { Event } from "../eventHandler"
import VolunteerModel from "../../models/volunteer"
import GuildModel from "../../models/guild"

export default class Invites implements Event {
  data = {
    enabled: true,
    once: false
  }

  async execute(bot: Bot, member: GuildMember) {
    member.guild.invites.fetch().then((newInvites) => {
      var oldInvites = bot.invites.get(member.guild.id)!

      var invite = newInvites.find(i => i.uses! > oldInvites.get(i.code)!);
      if (!invite) return;

      GuildModel.findOne({ guild_id: member.guild.id }).then(guild => {
        if (!guild || !guild.invites) return

        var invite_db = guild.invites.find((i) => i.code! == invite!.code!)
        if (!invite_db) return

        VolunteerModel.findOne({ ra: invite_db?.ra }).then(volunteer => {
          if (!volunteer) return

          member.setNickname(volunteer.nome!)
          volunteer.discord.push(member.id)
          volunteer.save()
        })
      })
    })
  }
}

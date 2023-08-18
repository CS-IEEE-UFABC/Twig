import { GuildMember, Role } from "discord.js";
import Bot from "../bot";
import Guild from "../models/guild";

export default function addRolesIfNeeded(bot: Bot, members: GuildMember[]) {
  members = members.filter((member) => !member.user.bot);
  Guild.findOne({ guild_id: members[0]!.guild.id }).then((doc) => {
    if (!doc || !doc.settings || !doc.settings["auto_role"]) return;
    var auto_role = (doc.settings.auto_role
      .map((role: string) => members[0]!.guild.roles.cache.get(role)) as Role[])
      .filter((role: Role) => role != undefined);

    members.forEach((member) => {
      var new_roles = auto_role
        .filter((role: Role) => !member.roles.cache.has(role.id));
      if (new_roles.length > 0) {
        member.roles.add(new_roles)

        bot.logger.verbose(`Adding roles [${new_roles.map((role) => role.name)}] to ${member.user.username}`)
      }
    })
  })
}

import { Collection, GuildMember, Role } from "discord.js";
import Bot from "../bot";

export default function addRolesIfNeeded(bot: Bot, members: GuildMember[]) {
  members = members.filter((member) => !member.user.bot);
  if (members.length == 0) return;

  bot.database.doc(`guilds/${members[0]!.guild.id}`).get().then((doc) => {
    if (!doc.data() || !doc.data()!.settings || !doc.data()!.settings.auto_role) {
      return;
    }

    var auto_role = doc.data()!.settings.auto_role
      .map((role: string) => members[0]!.guild.roles.cache.get(role))
      .filter((role: Role) => role != undefined) as Role[]

    members.forEach((member) => {
      var new_roles = auto_role
        .filter((role: Role) => !member.roles.cache.has(role.id));

      if (new_roles.length > 0) {
        member.roles.add(new_roles)

        bot.logger.debug(`Adding roles [${new_roles.map((role) => role.name)}] to ${member.user.username}`)
      }
    })
  })
}

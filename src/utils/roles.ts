import { Collection, GuildMember, Role } from "discord.js";
import Bot from "../bot";

export default function addRolesIfNeeded(bot: Bot, members: GuildMember[]) {
  members = members.filter((member) => !member.user.bot);
  if (members.length == 0) return;

  bot.database.doc(`settings/${members[0]!.guild.id}`).get().then((doc) => {
    if (!doc || !doc.data() || !doc.data()!.automatic_roles) return;

    var automatic_roles = doc.data()!.automatic_roles
      .map((role: string) => members[0]!.guild.roles.cache.get(role))
      .filter((role: Role) => role != undefined) as Role[]

    members.forEach((member) => {
      var new_roles = automatic_roles
        .filter((role: Role) => !member.roles.cache.has(role.id));

      if (new_roles.length > 0) {
        member.roles.add(new_roles)

        bot.logger.debug(`Adding roles [${new_roles.map((role) => role.name)}] to ${member.user.username}`)
      }
    })
  })
}

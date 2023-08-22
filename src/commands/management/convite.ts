
import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, AutocompleteInteraction, ChannelType, BaseGuildTextChannel } from "discord.js";
import Bot from "../../bot";
import VolunteerModel from "../../models/volunteer";
import GuildModel from "../../models/guild";

export default class {
  data = new SlashCommandBuilder()
    .setName('convite')
    .setDescription('Cria um convite único para o voluntário')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addNumberOption(option =>
      option.setName('ra')
        .setDescription('Registro Acadêmico (RA) do voluntário.')
        .setRequired(true)
        .setAutocomplete(true)
        .setMinValue(0)
    )

  async execute(bot: Bot, interaction: ChatInputCommandInteraction) {
    var RA = interaction.options.getNumber('ra')!.toString()

    VolunteerModel.findOne({ ra: RA }).then((volunteer) => {
      if (volunteer) {
        GuildModel.findOne({ guild_id: interaction.guildId }).then((guild) => {
          if (!guild) {
            guild = new GuildModel({ guild_id: interaction.guildId, invites: [] })
          }

          var invite = guild!.invites.find((invite) => invite.ra == volunteer.ra)

          if (!invite) {
            this.createInvite(interaction, guild, volunteer)
          } else {
            interaction.guild?.invites.fetch({ code: invite.code! })
              .then((guild_invite) => {
                if (!guild_invite) {
                  this.createInvite(interaction, guild, volunteer)
                } else {
                  this.replyInvite(interaction, volunteer.nome!, guild_invite.uses!, guild_invite.code!)
                }
              })
          }
        })
      } else {
        interaction.reply({ content: "❌ | Voluntário não encontrado", ephemeral: true })
      }
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  }

  async autocomplete(bot: Bot, interaction: AutocompleteInteraction) {
    var focused = interaction.options.getFocused();
    var regex = new RegExp(`${focused}`);

    VolunteerModel.find({ $or: [{ ra: regex }, { nome: regex }] }).then((volunteers) => {
      interaction.respond(
        volunteers.map(volunteer => ({ name: `${volunteer.nome!} (${volunteer.ra!})`, value: volunteer.ra! })),
      );
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  }

  private async createInvite(interaction: ChatInputCommandInteraction, guild: any, volunteer: any) {
    var default_channel = (interaction.guild!.channels.cache
      .find((channel) =>
        channel.type == ChannelType.GuildText && channel.rawPosition == 0)! as BaseGuildTextChannel)
    var invite = await default_channel.createInvite({ maxAge: 0, unique: true })

    guild!.invites.push({ code: invite.code, ra: volunteer.ra })
    guild!.save()

    this.replyInvite(interaction, volunteer.nome, 0, invite.code)

    return invite.code!
  }

  private replyInvite(interaction: ChatInputCommandInteraction, name: string, uses: number, code: string) {
    return interaction.reply({
      ephemeral: true,
      content:
        `👤 | Convite de \`${name}\`\n` +
        `🚩 | Usos: ${uses}\n` +
        `🌐 | https://discord.gg/${code}`
    })
  }
};

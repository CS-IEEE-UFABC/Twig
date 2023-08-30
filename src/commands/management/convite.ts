import { SlashCommandBuilder, type ChatInputCommandInteraction, PermissionFlagsBits, type AutocompleteInteraction, ChannelType, type BaseGuildTextChannel, Collection, type InteractionResponse, type Guild } from 'discord.js'
import type Bot from '../../bot'
import VolunteerModel from '../../models/volunteer'
import GuildModel from '../../models/guild'

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

  async execute (bot: Bot, interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.options.getNumber('ra') == null) {
      interaction.reply({ content: '❌ | RA não informado', ephemeral: true })
        .catch((err) => { bot.logger.error((err as Error).stack) })
      return
    }
    const RA = (interaction.options.getNumber('ra') as number).toString()

    VolunteerModel.findOne({ ra: RA }).then((volunteer) => {
      if (volunteer != null) {
        GuildModel.findOne({ guild_id: interaction.guildId }).then((guild) => {
          if (guild == null) {
            guild = new GuildModel({ guild_id: interaction.guildId, invites: [] })
          }

          const invite = guild.invites.find((invite) => invite.ra === volunteer.ra)

          if (invite == null) {
            this.createInvite(interaction, guild, volunteer, bot)
              .catch((err) => { bot.logger.error((err as Error).stack) })
          } else {
            (interaction.guild as Guild).invites.fetch({ code: invite.code as string })
              .then((guildInvite) => {
                if (guildInvite === null) {
                  this.createInvite(interaction, guild, volunteer, bot)
                    .catch((err) => { bot.logger.error((err as Error).stack) })
                } else {
                  this.replyInvite(interaction, volunteer.nome as string, guildInvite.uses as number, guildInvite.code)
                    .catch((err) => { bot.logger.error((err as Error).stack) })
                }
              }).catch((err) => { bot.logger.error((err as Error).stack) })
          }
        }).catch((err) => { bot.logger.error((err as Error).stack) })
      } else {
        interaction.reply({ content: '❌ | Voluntário não encontrado', ephemeral: true })
          .catch((err) => { bot.logger.error((err as Error).stack) })
      }
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  }

  async autocomplete (bot: Bot, interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused()
    const regex = new RegExp(`${focused}`, 'i')

    VolunteerModel.find({ $or: [{ ra: regex }, { nome: regex }] }).then((volunteers) => {
      interaction.respond(
        volunteers
          .map(volunteer => ({ name: `${volunteer.nome} (${volunteer.ra})`, value: volunteer.ra ?? '' }))
      ).catch((err) => { bot.logger.error((err as Error).stack) })
    }).catch((err) => { bot.logger.error((err as Error).stack) })
  }

  private async createInvite (interaction: ChatInputCommandInteraction, guild: any, volunteer: any, bot: Bot): Promise<string> {
    const defaultChannel = ((interaction.guild as Guild).channels.cache
      .find((channel) =>
        channel.type === ChannelType.GuildText &&
        channel.rawPosition === 0) as BaseGuildTextChannel)

    const invite = await defaultChannel.createInvite({ maxAge: 0, unique: true })

    guild.invites.push({ code: invite.code, ra: volunteer.ra })
    guild.save()

    if (!bot.invites.has(guild.id)) {
      bot.invites.set(guild.id, new Collection())
    }

    this.replyInvite(interaction, volunteer.nome, 0, invite.code)
      .catch((err) => { bot.logger.error((err as Error).stack) })

    return invite.code
  }

  private async replyInvite (interaction: ChatInputCommandInteraction, name: string, uses: number, code: string): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({
      ephemeral: true,
      content:
        `👤 | Convite de \`${name}\`\n` +
        `🚩 | Usos: ${uses}\n` +
        `🌐 | https://discord.gg/${code}`
    })
  }
};

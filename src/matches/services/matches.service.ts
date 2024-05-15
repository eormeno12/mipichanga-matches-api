import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, Player } from '../entities/matches.entity';
import { CreateMatchDto, TeamType, UpdateMatchDto } from '../dtos/matches.dtos';

@Injectable()
export class MatchesService {
  constructor(@InjectModel(Match.name) private matchModel: Model<Match>) {}

  private validateIfDocumentExists(document: Match | null, documentId: string) {
    if (!document) {
      throw new NotFoundException(
        "The Match with the id: '" + documentId + "' does not exist.",
      );
    }
  }

  findAll() {
    return this.matchModel.find(
      {},
      {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    );
  }

  async findOne(id: string) {
    const match = await this.matchModel.findOne(
      {
        _id: id,
      },
      {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    );

    this.validateIfDocumentExists(match, id);

    return match;
  }

  create(userId: string, payload: CreateMatchDto) {
    const match: Match = new this.matchModel({
      createdBy: userId,
      ...payload,
    });

    return match.save();
  }

  async update(userId: string, id: string, payload: UpdateMatchDto) {
    const match = await this.matchModel.findOne({
      _id: id,
      createdBy: userId,
    });

    match.set(payload);

    return match.save();
  }

  async delete(userId: string, id: string) {
    const res = await this.matchModel.deleteOne({ _id: id, createdBy: userId });

    return res;
  }

  async addPlayerToMatch(matchId: string, team: TeamType, player: Player) {
    const match = await this.findOne(matchId);
    const isPositionAlreadyTaken = match[team].players.some(
      (p) => p.pos === player.pos,
    );

    if (isPositionAlreadyTaken) {
      throw new NotFoundException(
        'The position ' + player.pos + ' is already taken.',
      );
    }

    match[team].players.push(player);
    return match.save();
  }

  async removePlayerFromMatch(matchId: string, playerId: string) {
    const match = await this.findOne(matchId);

    let team: TeamType = 'home';
    let playerIndex = match.home.players.findIndex((p) => p._id === playerId);

    if (playerIndex === -1) {
      playerIndex = match.away.players.findIndex((p) => p._id === playerId);
      team = 'away';
    }

    if (playerIndex === -1) {
      throw new NotFoundException(
        "The player with the id: '" + playerId + "' does not exist.",
      );
    }

    match[team].players.splice(playerIndex, 1);
    return match.save();
  }
}

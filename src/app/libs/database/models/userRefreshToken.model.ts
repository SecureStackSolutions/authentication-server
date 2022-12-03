import {
	Table,
	Column,
	Model,
	DataType,
} from 'sequelize-typescript';

@Table({
	tableName: 'user_refresh_token',
	timestamps: false,
	underscored: true,
})
export class UserRefreshToken extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
	})
	userId!: number;

	@Column({
		type: DataType.STRING,
		primaryKey: true,
	})
	token!: string;
}

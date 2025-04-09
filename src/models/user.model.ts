import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url: string | null;
  is_active: boolean;
  is_admin: boolean;
  is_verified: boolean;
  verification_token: string | null;
  created_at: Date;
  updated_at: Date;
  refresh_token?: string | null;
  password_ResetToken?: string | null;
  password_ResetExpires?: number | null;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'avatar_url' | 'is_active' | 'is_admin' | 'created_at' | 'updated_at' | 'is_verified' | 'verification_token'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public avatar_url!: string | null;
  public is_active!: boolean;
  public is_admin!: boolean;
  public is_verified!: boolean;
  public verification_token!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public refresh_token: string | null;
  public password_ResetToken: string | null;
  public password_ResetExpires: number | null;

  setPassword(value: string) {
    this.password = value;
  }

  setRefreshToken(value: string | null) {
    this.refresh_token = value;
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return candidatePassword === this.password;
  }

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        avatar_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        is_admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        verification_token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        refresh_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password_ResetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password_ResetExpires: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'user',
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default User;

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
  passwordResetToken?: string | null;
  passwordResetExpires?: number | null;
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
  public passwordResetToken: string | null;
  public passwordResetExpires: number | null;

  setPassword(value: string) {
    this.password = value;
  }

  setRefreshToken(value: string | null) {
    this.refresh_token = value;
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    // Implement password comparison logic here
    // This should compare candidatePassword with this.password
    // Return true if they match, false otherwise
    return candidatePassword === this.password; // Replace with actual hash comparison
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
        passwordResetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        passwordResetExpires: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        // Khai báo lại created_at và updated_at
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
        timestamps: true, // Sequelize sẽ tự động quản lý các trường created_at và updated_at
        underscored: true, // Sử dụng snake_case cho tên trường
      }
    );
  }
}

export default User;

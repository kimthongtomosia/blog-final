import { DataTypes, Model, Sequelize } from 'sequelize';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published' | 'private';
  view_Count: number;
  user_id: number;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

export default class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public excerpt!: string | null;
  public status!: 'draft' | 'published' | 'private';
  public view_Count!: number;
  public user_id!: number;
  public category_id!: number | null;
  public created_at!: Date;
  public updated_at!: Date;
  public published_at!: Date | null;

  static initModel(sequelize: Sequelize) {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        excerpt: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
          validate: {
            isIn: [['draft', 'published', 'private']],
          },
        },
        view_Count: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'categories',
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        published_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: true,
        underscored: true,
      }
    );
  }
}

import { DataTypes, Model, Sequelize } from 'sequelize';

interface PostAttributes {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published' | 'private';
  viewCount: number;
  userId: number;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export default class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
  public excerpt!: string | null;
  public status!: 'draft' | 'published' | 'private';
  public viewCount!: number;
  public userId!: number;
  public categoryId!: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public publishedAt!: Date | null;

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
        slug: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
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
        viewCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'categories',
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        publishedAt: {
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

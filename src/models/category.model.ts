import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  'id' | 'slug' | 'description' | 'created_at' | 'updated_at'
>;

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
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
        modelName: 'category',
        tableName: 'categories',
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Category;

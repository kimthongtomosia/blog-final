import { DataTypes, Model, Sequelize } from 'sequelize';

interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryInstance extends Model<CategoryAttributes>, CategoryAttributes {
  initialize(sequelize: Sequelize): void;
}

export default class Category extends Model<CategoryInstance, CategoryAttributes> implements CategoryInstance {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public initialize(sequelize: Sequelize): void {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        slug: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        _attributes: '',
        sequelize: '',
        destroy: '',
        restore: '',
        update: '',
        increment: '',
        decrement: '',
        addHook: '',
        removeHook: '',
        hasHook: '',
        hasHooks: '',
        initialize: '',
        dataValues: '',
        _creationAttributes: '',
        isNewRecord: '',
        where: '',
        getDataValue: '',
        setDataValue: '',
        get: '',
        set: '',
        setAttributes: '',
        changed: '',
        previous: '',
        save: '',
        reload: '',
        validate: '',
        equals: '',
        equalsOneOf: '',
        toJSON: '',
        isSoftDeleted: '',
        _model: '',
      },
      {
        sequelize,
        modelName: 'category',
        tableName: 'categories',
        timestamps: true,
      }
    );
  }
}

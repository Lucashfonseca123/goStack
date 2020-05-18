import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarFieldToUsers1587596369193
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Criando uma coluna nova
		queryRunner.addColumn(
			'users',
			new TableColumn({
				name: 'avatar',
				type: 'varchar',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		queryRunner.dropColumn('users', 'avatar');
	}
}

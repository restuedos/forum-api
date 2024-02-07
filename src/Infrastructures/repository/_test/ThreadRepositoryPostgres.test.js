const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123456', username: 'edzerooo' });

        const newThread = new AddThread({
          title: 'sebuah thread',
          body: 'Lorem ipsum dolor sit amet',
          owner: 'user-123456',
        });

        const fakeIdGenerator = () => '123456789abcdef';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        const thread = await ThreadsTableTestHelper.findThreadsById('thread-123456789abcdef');
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123456789abcdef',
          title: 'sebuah thread',
          owner: 'user-123456',
        }));
        expect(thread).toHaveLength(1);
      });
    });
  });
});

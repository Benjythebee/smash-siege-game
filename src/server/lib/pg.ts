import pgI from 'pg';
import type { QueryResult, QueryResultRow, QueryConfig, QueryConfigValues } from 'pg';
import { ConnectionOptions } from 'tls';
import { performance } from 'perf_hooks';
import env from './env';

function debugLog<I extends any[] = any[]>(startTime: number, res: QueryResult, queryTextOrConfig: string | QueryConfig<I>) {
  console.debug(`(${since(startTime)}sec, ${res.rowCount} rows): ${toLine(queryTextOrConfig)}`);
}

function errorLog<I extends any[] = any[]>(startTime: number, err: Error, queryTextOrConfig: string | QueryConfig<I>) {
  console.error(`(${since(startTime)}sec) '${err.toString()}': ${toLine(queryTextOrConfig)}`);
}

const since = (startTime: number) => ((performance.now() - startTime) / 1000.0).toFixed(2);

// converts a string into a one line string
const toLine = <I extends any[] = any[]>(sql: string | QueryConfig<I>): string => {
  sql = typeof sql === 'string' ? sql : sql.text;
  try {
    return (
      sql
        // remove Unicode line break characters
        .replace(/[/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, ' ')
        // remove double whitespaces
        .replace(/\s+/g, ' ')
        .trim()
    );
  } catch (err) {}
  return '';
};

interface ConnectResult {
  query: <R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: QueryConfigValues<I>,
    callback?: (err: Error, result: QueryResult<R>) => void
  ) => Promise<QueryResult<R> | undefined>;
  drain: () => Promise<void>;
}
export function Connect(): ConnectResult {
  const connectionString = env.DATABASE_URL || '';

  let sslSettings: boolean | ConnectionOptions = {
    rejectUnauthorized: false
  };

  if (process.env.CA_CERT) {
    sslSettings = {
      rejectUnauthorized: false,
      ca: process.env.CA_CERT
    };
  } else if (env.DATABASE_URL?.includes('localhost') || env.DATABASE_URL?.includes('winhost')) {
    sslSettings = false;
  }

  const pool = new pgI.Pool({
    connectionString,
    max: 10,
    ssl: sslSettings,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000
  });

  function query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: QueryConfigValues<I>
  ): Promise<QueryResult<R> | undefined> {
    return pool
      .connect()
      .then((client) => {
        const startTime = performance.now();

        return client
          .query(queryTextOrConfig, values)
          .then((res) => {
            debugLog(startTime, res, queryTextOrConfig);
            return res;
          })
          .catch((err) => {
            errorLog(startTime, err, queryTextOrConfig);
            return Promise.reject(err);
          })
          .finally(() => {
            client.release();
          });
      })
      .catch((err) => {
        console.error(`pg.Pool connection failure: ${err.toString()}`);
        return Promise.reject(err);
      });
  }

  // drain the pool of all active clients, disconnect them, and shut down any internal timers in the pool
  async function drain() {
    await pool.end();
  }
  return {
    query,
    drain
  };
}
export const pg = Connect();

import { format, formatISO } from '@invoice-system/shared';
import { RequestHandler } from 'express';
import mysql from 'mysql2/promise';

import { parseXLSXFile } from '../../service/xlsx-parse';

async function dbConnect() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  };

  return mysql.createConnection(config);
}

async function bulkInsert(data: any[]): Promise<any> {
  const db = await dbConnect();
  const query = `INSERT INTO input
    (date, firstName, middleName, lastName, courseName, isPayment, amount, currency, method) VALUES ?`;

  const inserts = [data];
  const [result] = await db.query(query, inserts);
  db.end();

  return result;
}

const fixDate = (date: any) => {
  const dateSerialNumber = date;

  if (typeof dateSerialNumber === 'number') {
    date = new Date((dateSerialNumber - (25567 + 2)) * 86400 * 1000);
    date = format(date, 'MM/dd/yyyy');
  } else {
    const dateArr = date.split('/');
    dateArr.reverse();
    date = dateArr.join('-');
  }

  date = formatISO(new Date(date), { representation: 'date' });
  return date;
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const toTitle = (course: string) => {
  let courseList: any[] = course.toLowerCase().split(' ');

  courseList = courseList.map(c => {
    if (c) return capitalizeFirstLetter(c);
  });

  return courseList.join(' ');
};

const buildName = (name: string) => {
  const nameList: any = name.split(' ');
  let [firstName, middleName, ...rest] = nameList;
  let lastName = rest.join(' ').trim();

  firstName = capitalizeFirstLetter(firstName.trim());
  middleName = middleName && capitalizeFirstLetter(middleName.trim());

  if (rest.length === 0) {
    lastName = middleName;
    middleName = null;
  } else {
    lastName = toTitle(lastName);
  }

  return {
    firstName,
    middleName,
    lastName,
  };
};

const httpParseXLSX: RequestHandler = async (_, res) => {
  const data = parseXLSXFile('income2023');

  const inserted = data.map((item, index) => {
    console.log(item);

    const { firstName, middleName, lastName } = buildName(item.name);

    const date = typeof item.date === 'string' ? item.date.trim() : item.date;

    try {
      fixDate(date);
    } catch (err) {
      console.log('invalid date', date);

      console.log('error at index', index);
    }

    return [
      fixDate(date),
      firstName,
      middleName,
      lastName,
      item.courseName.trim(),
      Boolean(item.isPayment),
      parseFloat(item.amount),
      item.currency.trim(),
      item.method.trim(),
    ];
  });

  const result = await bulkInsert(inserted);

  const rows = result.affectedRows!;
  return res.status(201).send({ message: `${rows} rows have been inserted successfully.` });
};

export { httpParseXLSX };

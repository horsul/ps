const fs = require('fs').promises
const path = require('path')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

class Sqlite {
  constructor(db) {
    this.db = db
  }

  static async init(path) {
    const tables = ['groups', 'orders', 'parameters', 'parameters_value', 'users', 'users_discount', 'users_token', 'users_field', 'ware_orders', 'wares', 'wares_unorder']

    const db = await open({
      filename: path,
      driver: sqlite3.Database
    })

    // for (const table of tables) {
    //   await db.exec(`drop table if exists ${table}`)
    // }

    await db.exec(`create table if not exists groups (
        id_groups integer primary key,
        sort_groups integer default 0,
        name_groups text not null default 'Группа товаров',
        belong_groups integer not null default 0,
        visibility integer not null default 1,
        meta_noindex integer not null default 0
    )`)

    await db.exec(`create table if not exists orders (
        id_orders integer primary key,
        time_order integer not null default 0,
        date_orders integer not null default 0,
        id_users integer not null,
        status_id integer not null default 1,
        status_date integer not null default 1,
        sum_all real not null default 0,
        size_discount real not null default 0,
        usd_course real not null default 0,
        usd_course_bn real not null default 0,
        payment_id integer not null default 0,
        payment_face_id integer not null default 0,
        delivery_id integer not null default 0,
        content_remark text,
        cur_ID_user real not null default 0,
        cur_type_user text,
        course_nal_user real not null default 0,
        course_bnal_user real not null default 0,
        cur_ID_admin real not null default 0,
        cur_type_admin text,
        course_nal_admin real not null default 0,
        course_bnal_admin real not null default 0,
        cur_ID_national real not null default 0,
        cur_type_national text,
        course_nal_national real not null default 0,
        course_bnal_national real not null default 0
    )`)

    await db.exec(`create table if not exists parameters (
        id_param integer primary key,
        id_groups integer not null,
        name_param text,
        unit_param text,
        sort_param integer not null default 100,
        visibility integer not null default 0,
        factor integer not null default 0
    )`)

    await db.exec(`create table if not exists parameters_value (
        id_val_param integer primary key,
        id_param integer not null,
        id_wares integer not null,
        value_param text
    )`)

    await db.exec(`create table if not exists users (
        id_user integer primary key,
        name_user text,
        s_name_user text,
        o_name_user text,
        email_user text,
        password text,
        telephone text,
        fax text,
        area text,
        city text,
        street text,
        house text,
        body text,
        entrance text,
        code text,
        floor text,
        apartment text,
        lift text,
        company text,
        legal_address text,
        actual_address text,
        inn text,
        kpp text,
        okpo text,
        okhx text,
        bank_name text,
        rs_count text,
        kor_count text,
        bik text,
        dop_content text,
        post_index text,
        pers_discount real not null default 0,
        accum_discount real not null default 0
    )`)

    await db.exec(`create table if not exists users_discount (
        id_discount integer primary key,
        id_user integer not null,
        size_discount real not null
    )`)

    await db.exec(`create table if not exists users_field (
        id_field integer primary key,
        name_field text,
        descript_field text,
        type_field text,
        value_default text,
        sort_field integer not null default 0,
        visibility integer not null default 0,
        area_table integer not null default 0,
        select_field text
    )`)

    await db.exec(`create table if not exists users_token (
      id_token integer primary key,
      token text not null,
      id_user integer not null
  )`)

    await db.exec(`create table if not exists ware_orders (
        id integer primary key,
        id_orders integer not null default 0,
        id_wares integer not null default 0,
        code_wares integer not null default 0,
        name_wares text,
        amount integer not null default 0,
        price_for_one real not null default 0,
        partnumber text
    )`)

    await db.exec(`create table if not exists wares (
        id_wares integer primary key,
        partnumber text,
        code_wares integer not null default 0,
        id_vendor integer not null default 0,
        sort_wares integer not null default 100,
        name_wares text default 'Название товара',
        descript_wares text,
        belong_groups integer not null default 0,
        visibility integer not null default 0,
        new integer not null default 0,
        new_time text,
        sellout integer not null default 0,
        amount integer not null default 0,
        shop_win integer not null default 0,
        description integer not null default 0,
        price real not null default 0,
        price_old real not null default 0,
        warranties integer not null default 0,
        meta_noindex integer not null default 0,
        yandex text,
        transit text
    )`)

    await db.exec(`create table if not exists wares_unorder (
        id_unorder integer primary key,
        id_wares integer not null default 0,
        price_unorder real not null default 0,
        date_unorder integer not null default 0,
        amount_unorder integer not null default 0,
        id_user integer not null default 0
    )`)

    // await importData(db)

    return new Sqlite(db)
  }

  async groups() {
    try {
      return await this.db.all(`select id_groups as id, sort_groups as sort, name_groups as name, belong_groups as parentId from groups where visibility = 1`)
    } catch (error) {
      console.log('err', error)
    }
  }

  async users() {
    try {
      return await this.db.all(`select id_user as id, name_user as name, s_name_user as surname, o_name_user as o_name, email_user as email, password from users`)
    } catch (error) {
      console.log('err', error)
    }
  }

  async user(id) {
    try {
      return await this.db.get(`select * from users where id_user = ?`, id)
    } catch (error) {
      console.log('err', error)
    }
  }

  async token(token) {
    try {
      return await this.db.get(`select * from users_token where token = ?`, token)
    } catch (error) {
      console.log('err', error)
    }
  }

  async addToken({ token, id_user }) {
    try {
      return await this.db.run(`insert into users_token (token, id_user) values(?, ?)`, [token, id_user])
    } catch (error) {
      console.log('err', error)
    }
  }

  async removeTokenByUser({ id_user }) {
    try {
      return await this.db.run(`delete from users_token where id_user = ?`, id_user)
    } catch (error) {
      console.log('err', error)
    }
  }

  async userByEmail(email) {
    try {
      return await this.db.get(`select * from users where email_user = ?`, email)
    } catch (error) {
      console.log('err', error)
    }
  }

  async userByToken(token) {
    try {
      return await this.db.get(`select u.* from users u inner join users_token t on u.id_user = t.id_user where token = ?`, token)
    } catch (error) {
      console.log('err', error)
    }
  }
}

async function importData(db) {
  const tables = ['groups', 'orders', 'parameters', 'parameters_value', 'users', 'users_discount', 'users_field', 'ware_orders', 'wares', 'wares_unorder']
  const separator = ';'
  const trimMask = /^\"+|\"+$/g

  const dates = {
    orders: ['date_orders', 'status_date'],
    wares_unorder: ['date_unorder']
  }

  for (const table of tables) {
    const buffer = await fs.readFile(path.resolve(__dirname, '../../db/csv', `${table}.csv`), 'utf-8')

    const array = buffer.toString().split(/\r?\n/)

    const columns = array[0].split(separator).map(r => r.replace(trimMask, ''))

    let dateIndexes = null
    if (dates[table]) {
      dateIndexes = dates[table].map(r => columns.indexOf(r))
    }

    const rows = array
      .filter((r, i) => i > 0 && r.trim() !== '')
      .map(
        row =>
          `(${row
            .split(separator)
            .map((r, i) => {
              if (dateIndexes && dateIndexes.includes(i) && r) {
                return new Date(r.replace(trimMask, '')).getTime()
              }
              if (r === '') {
                return 'null'
              }
              return r
            })
            .join(', ')})`
      )
      .join(', ')

    await db.exec(`insert into ${table} (${columns.join(', ')}) values ${rows};`)
  }
}

module.exports = Sqlite

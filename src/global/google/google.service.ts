import { Injectable, OnModuleInit } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth/build/src/index';
import * as fs from 'node:fs/promises';
import { OAuth2Client } from 'google-auth-library';
import * as path from 'path';
import { GlobalOptions } from 'googleapis/build/src/apis/abusiveexperiencereport';

/*
  TODO:Make the app authenticate the tokens from user side and gain access to user calendar rather than our epApp account later
*/
@Injectable()
export class GoogleService implements OnModuleInit {
  private TOKEN_PATH: string;
  private CREDENTIALS_PATH: string;
  private SCOPES: string[];
  private client: GlobalOptions['auth'];
  private calendar: calendar_v3.Calendar;
  constructor() {
    this.SCOPES = ['https://www.googleapis.com/auth/calendar'];
    this.TOKEN_PATH = path.join(process.cwd(), 'token.json');
    this.CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
  }

  get gCalendar() {
    return this.calendar;
  }

  get gClient() {
    return this.client;
  }

  //TODO: Invoke the methods when user logs in instead of this
  async onModuleInit() { 
    this.client = await this.authorize();
    this.calendar = google.calendar({ version: 'v3', auth: this.client });
  }

  async loadSavedCredentialsIfExist(): Promise<any> {
    try {
      const content = await fs.readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(String(content));
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client: any) {
    const content = await fs.readFile(this.CREDENTIALS_PATH);
    const keys = JSON.parse(String(content));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(this.TOKEN_PATH, payload);
  }

  async authorize(): Promise<OAuth2Client> {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }
}

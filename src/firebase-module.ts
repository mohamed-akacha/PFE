import { Module } from '@nestjs/common';

var admin = require("firebase-admin");
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

@Module({
  providers: [{
    provide: 'FIREBASE',
    useValue: admin
  }],
  exports: ['FIREBASE']
})
export class FirebaseModule {}

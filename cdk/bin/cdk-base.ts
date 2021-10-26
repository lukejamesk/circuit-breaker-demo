#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkBaseStack } from '../lib/cdk-base-stack';
import getConfig from '../common/getConfig';

const { STACK_NAME } = getConfig();

const app = new cdk.App();
new CdkBaseStack(app, STACK_NAME);

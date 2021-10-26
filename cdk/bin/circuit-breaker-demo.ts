#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CircuitBreakerDemoStack } from '../lib/circuit-breaker-demo-stack';
import getConfig from '../common/getConfig';

const { STACK_NAME } = getConfig();

const app = new cdk.App();
new CircuitBreakerDemoStack(app, STACK_NAME);

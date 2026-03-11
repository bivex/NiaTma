// This file is normally used for setting up analytics and other
// services that require one-time initialization on the client.

import { bootstrapTelegramRuntime } from '@/features/telegram-runtime/infrastructure/bootstrap';

void bootstrapTelegramRuntime();

import { Controller } from '@nestjs/common';
import { SignalService } from 'src/signal/signal.service';

@Controller()
export class XrayController {
  constructor(private readonly signalService: SignalService) {}
}

import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { fecthAdapter } from './adapters/fecth.adapter';

@Module({
    imports: [],
    controllers: [],
    providers: [AxiosAdapter, fecthAdapter],
    exports: [AxiosAdapter,fecthAdapter],
})
export class CommonModule {}

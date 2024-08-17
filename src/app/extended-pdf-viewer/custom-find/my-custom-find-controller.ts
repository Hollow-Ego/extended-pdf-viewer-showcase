import { PDFFindController } from './pdf_find_controller';

export class MyCustomFindController extends PDFFindController {
  constructor({ linkService, eventBus, updateMatchesCountOnProgress = true, pageViewMode }: any) {
    super({ linkService, eventBus, updateMatchesCountOnProgress, pageViewMode });
    console.log('MyFindController constructor');
  }

  public onFind(state) {
    console.log('custom onFind', state);
    super.onFind(state);
  }
}

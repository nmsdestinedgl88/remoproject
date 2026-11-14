import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';
import {ManetrustVideo, MT_SECONDS} from './manetrust/ManetrustVideo';
import {MondayVideo, MON_SECONDS} from './papertour/Monday';
import {WednesdayVideo, WED_SECONDS, SundayVideo, SUN_SECONDS} from './papertour/Info2';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CreditVideo"
        component={CreditVideo}
        durationInFrames={CREDIT_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ManetrustVideo"
        component={ManetrustVideo}
        durationInFrames={MT_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="MondayTax" component={MondayVideo} durationInFrames={Math.round(MON_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="WednesdayFunding" component={WednesdayVideo} durationInFrames={Math.round(WED_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Sunday54gene" component={SundayVideo} durationInFrames={Math.round(SUN_SECONDS * 30)} fps={30} width={1080} height={1920} />
    </>
  );
};

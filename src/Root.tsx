import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';
import {EliakimVideo, ELIAKIM_SECONDS} from './eliakim/EliakimVideo';
import {PaacVideo, PAAC_SECONDS} from './paac/PaacVideo';

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
        id="EliakimVideo"
        component={EliakimVideo}
        durationInFrames={ELIAKIM_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition id="PaacVideo" component={PaacVideo} durationInFrames={PAAC_SECONDS * 30} fps={30} width={1080} height={1440} />
    </>
  );
};

import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {QuickreachPromo, QuickreachStatus, QR_FRAMES} from './qr/Promo';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';

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
      <Composition id="QuickreachPromo" component={QuickreachPromo} durationInFrames={QR_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="QuickreachStatus" component={QuickreachStatus} durationInFrames={QR_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};

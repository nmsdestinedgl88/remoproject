import { Composition } from "remotion";
import { Outro } from "./Outro";
import { theme } from "./theme";

export const Root: React.FC = () => (
  <>
  <Composition
    id="Outro"
    component={Outro}
    durationInFrames={theme.duration * theme.fps}
    fps={theme.fps}
    width={1920}
    height={1080}
  />
  <Composition
    id="OutroVertical"
    component={Outro}
    defaultProps={{ vertical: true }}
    durationInFrames={theme.duration * theme.fps}
    fps={theme.fps}
    width={1080}
    height={1920}
  />
  </>
);

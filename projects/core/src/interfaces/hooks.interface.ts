export interface HooksInterface {
  connected: (() => void)[];
  disconnected: (() => void)[];
  beforeChangeDetection: (() => void)[];
  afterChangeDetection: (() => void)[];
  afterViewInit: (() => void)[];
  attributeChanged: ((...attrs: string[]) => void)[];
  adopted: (() => void)[];
}

import Image from './Image';

export default interface Planet {
  id: number;
  name: string;
  description: string;
  image: Image;
  isHabitable: boolean;
}

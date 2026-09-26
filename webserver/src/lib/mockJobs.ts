//AI generated using Gemini:
//prompt: "Using the given interface, generate a few examples of services offered by freelancers on an Ethereum based freelancing platform"
export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  freelancerAddress: string;
}

export const mockServices: Service[] = [
  {
    id: 1,
    title: "I will make a 3D model of your dog from a photo",
    description: "I will create a high-detail, 3D printable model of your pet based on a few reference photos.",
    price: 0.15,
    deliveryDays: 4,
    freelancerAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  },
  {
    id: 2,
    title: "I will design a clean minimalist logo for your brand",
    description: "Professional vector logo design including full brand identity guidelines and high-res exports.",
    price: 0.25,
    deliveryDays: 3,
    freelancerAddress: "0x3C44CdD05a9006646305A192801843F51184ec7B",
  },
  {
    id: 3,
    title: "I will edit a fast-paced 60-second video for TikTok or Reels",
    description: "Engaging short-form video editing with custom transitions, subtitles, sound effects, and color grading.",
    price: 0.08,
    deliveryDays: 2,
    freelancerAddress: "0x90F79bf6EB2c4f80806536482872910c2d739069",
  },
  {
    id: 4,
    title: "I will translate your website or document to Spanish",
    description: "Native Spanish translation for landing pages, user manuals, or marketing copy. No AI translation.",
    price: 0.05,
    deliveryDays: 1,
    freelancerAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
  }
];
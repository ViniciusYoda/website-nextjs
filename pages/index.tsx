import { withTemplateConfig } from "@src/services/template/withTemplateConfig";
export { default } from '@src/screens/HomeScreen/HomeScreen';

export async function getStaticProps() {
  return {
    props: await withTemplateConfig({
      exemplo: "teste",
    })
  }
}
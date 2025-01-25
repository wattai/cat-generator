import { NextPage, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css"

// GetServerSideProps から渡される props の型
type Props = {
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // useState を使って状態を定義する
  const [imageUrl, setImageUrl] = useState(initialImageUrl);  // 初期値を渡す
  // マウント時に画像を読み込む宣言
  const [loading, setLoading] = useState(false);  // 初期状態は false にしておく

  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url);  // 画像 URL の状態を更新する
  //     setLoading(false);  // ローディング状態を更新する
  //   });
  // }, []);

  // ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    setLoading(true);  // 読み込みフラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url);  // 画像 URL の状態を更新する
    setLoading(false);  // 読み込み中フラグを倒す
  };
  // ローディング中でなければ、画像を表示する
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button> 
      <div className={styles.frame}>
        {loading || <img src={imageUrl} />}
      </div>
    </div>
  );
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  // 配列として表現されているか？
  if (!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした");
  }
  const image: unknown = images[0];
  // Image の構造をなしているのか？
  if (!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした");
  }
  return images[0];
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
  // 値がオブジェクトなのか？
  if (!value || typeof value !== "object") {
    return false;
  }
  // url プロパティが存在し、かつ、それが文字列なのか？
  return "url" in value && typeof value.url === "string";
}

// fetchImage().then((image) => {
//   console.log(image.alt);
// });

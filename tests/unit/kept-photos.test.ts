import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

// specs/005-contact-form — FR-IMG-002 / SC-012: the photo refresh replaces
// five photos and must not change a single byte of any other image. Each
// value below is the SHA-256 of the file as committed before the refresh
// (taken from HEAD on 2026-11-14). If one of these images is ever changed on
// purpose, that is a new decision: update its hash in the same change.
const KEPT: Record<string, string> = {
  "public/images/site/brahman-four.jpg":
    "1d4ab612dc1aa6e5ea32a1429bc9f0c398ba88c7f345c391b4422067a026048b",
  "public/images/site/florian.jpg":
    "481a94dcbd9bbaf11ca384168f3ec7fdfee69b5dcfe66028177b542a5f828a85",
  "public/images/site/gaucho-nelore.jpg":
    "0c0db899ae1cf42025204e6d1afe6aebc52d4604ccf159fa8132575444beb59b",
  "public/images/site/grazing-bright.jpg":
    "780da9227bd2068662f9f3a4f2a76d32026b78abd8666b957984dfe854c3f656",
  "public/images/site/nelore-herd.jpg":
    "8207ed4a1ae626bbf22cd883e09da47efe03e5ea926eb12a5cd98e15e0560c3a",
  "public/images/site/orbolo-cattle-shade.jpg":
    "95293a01e8052efaadf4e5726f89b29b84832715a826c234c01c183e57db52b2",
  "public/images/site/orbolo-gauchos.jpg":
    "a182468336745a46acf8dcd42d6ab8717a8bb868ebf74de0a561a8db9206c5f1",
  "public/images/site/orbolo-palms.jpg":
    "8c22063f18ae1c3a003dd83914280c33b558c73322dc1f1245d91036de4beb12",
  "public/images/site/orbolo-walk.jpg":
    "96d53ad987b476bb3921cc74bd44d4247760796539e96daac28a90e719d8c803",
  "public/images/site/pasture-top.jpg":
    "230a0addfe64812f0b636976b2f642e19931547884e8b9dfafea3323888ace32",
  "public/images/site/shade-tree.jpg":
    "347eabc4b2f8698285f587dd45addfc9652768942c47b3c2b1281028f7ea04d7",
  "public/images/site/cow-lines-lime.png":
    "d0eb2c9fff5cd5149f705ee33ae593ad08f40a895b49a94bada50ba37a6a9a7d",
  "public/images/brand/Orbolo_Logo_BrandGreen.svg":
    "0a62f8783f966a8e2dcc9684ce3c5ad53b1d9d0a6dacad9fbf45ea7b0538ca90",
  "public/images/brand/logo-paper.svg":
    "5b837d1d6924125aeedc745ff48485dae3aa7d281bea1fa6f5b154128cab421e",
  "public/images/branding/orbolo-logo.png":
    "b2f9cde8dceb685807d94068333659c1fce82cadb85aa80b47e459d6c25eba36",
  "public/images/paths/buyers.jpg":
    "a9ad40fea0a1174ca1d4cb25e48a74edeb7ecea3cee09adfbcb2b613a06ecd96",
  "public/images/paths/investors.jpg":
    "a182468336745a46acf8dcd42d6ab8717a8bb868ebf74de0a561a8db9206c5f1",
  "public/images/paths/landowners.jpg":
    "8c22063f18ae1c3a003dd83914280c33b558c73322dc1f1245d91036de4beb12",
  "public/images/social/og-default.png":
    "5f181905645f4171530f727f3447fc7246d799052c7e83e3fb2fc9c480550dd0",
};

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("kept images are byte-identical (FR-IMG-002)", () => {
  it.each(Object.entries(KEPT))("%s", (path, expected) => {
    expect(sha256(path)).toBe(expected);
  });

  it("covers every file in the four untouched folders", () => {
    for (const dir of [
      "public/images/paths",
      "public/images/brand",
      "public/images/branding",
      "public/images/social",
    ]) {
      for (const file of readdirSync(dir)) {
        if (file.startsWith(".")) continue;
        expect(Object.keys(KEPT), `${dir}/${file} is not pinned`).toContain(`${dir}/${file}`);
      }
    }
  });
});

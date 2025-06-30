// app/upload-v3/page.jsx (클라이언트 컴포넌트)
"use client";

import { useState } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Upload } from "@aws-sdk/lib-storage";

// Cognito 및 S3 설정 정보 (환경 변수로 관리)
const COGNITO_IDENTITY_POOL_ID = process.env
  .NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string;
const S3_REGION = process.env.NEXT_PUBLIC_REGION as string;
const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME as string;

// S3 클라이언트 인스턴스 생성
// credential-provider-cognito-identity를 사용하여 임시 자격 증명 제공
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: S3_REGION }, // Cognito Identity 서비스 리전
    identityPoolId: COGNITO_IDENTITY_POOL_ID,
  }),
});

export default function S3UploaderV3() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("파일을 선택해주세요.");
      return;
    }
    console.log(S3_REGION);
    console.log(S3_BUCKET_NAME);
    console.log(COGNITO_IDENTITY_POOL_ID);
    setUploading(true);
    setMessage("업로드 중...");
    setProgress(0);

    const fileName = `${Date.now()}-${file.name}`; // 고유한 파일 이름 생성
    const s3Key = `uploads/${fileName}`; // S3 버킷 내 경로

    try {
      // @aws-sdk/lib-storage의 Upload 유틸리티 사용 (멀티파트 업로드 자동 처리)
      const uploader = new Upload({
        client: s3Client, // 위에서 생성한 S3Client 인스턴스
        params: {
          Bucket: S3_BUCKET_NAME,
          Key: s3Key,
          Body: file,
          ContentType: file.type,
          // ACL: 'public-read' // 필요하다면 공개 접근 설정 (보안 고려 신중히 사용)
        },
        queueSize: 4, // 동시 업로드 파트 수
        partSize: 1024 * 1024 * 5, // 각 파트 크기 (5MB)
      });

      // 진행 상태 추적
      uploader.on("httpUploadProgress", (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent?.loaded ?? 0 * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      // 업로드 실행
      const data = await uploader.done();

      console.log(data);
      console.log("S3 업로드 성공:", data.Location);
      setMessage(`업로드 성공! 파일 위치: ${data.Location}`);
      setFile(null); // 파일 선택 초기화
    } catch (error) {
      console.error("S3 업로드 에러:", error);
      setMessage(`업로드 실패: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", textAlign: "center" }}
      className="bg-white text-black"
    >
      <h1>S3 파일 업로드 (AWS SDK v3 + Cognito Identity Pool)</h1>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "업로드 중..." : "S3에 업로드"}
      </button>

      {uploading && (
        <div style={{ marginTop: "20px" }}>
          <progress value={progress} max="100" style={{ width: "80%" }} />
          <p>{progress}% 완료</p>
        </div>
      )}
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: uploading
              ? "blue"
              : message.includes("성공")
              ? "green"
              : "red",
          }}
        >
          {message}
        </p>
      )}

      {file && <p>{JSON.stringify(file)}</p>}
    </div>
  );
}

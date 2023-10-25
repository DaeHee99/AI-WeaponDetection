# AI Weapon Detection

### AI를 활용한 칼부림 사건 예방 프로젝트 (자동 위험 물체 탐지 및 경보)

## 배경

<img width="500" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/fe46ee42-9bb4-4648-87e6-6e51a07d7857"> <br />

  * 최근 칼부림 사건이 빈번하게 발생하고 있으며, 언제 어디서 갑자기 사고가 발생할 지 전혀 예측할 수 없음
  * 사고 예방을 위한 수많은 인력 투입의 물리적 한계가 존재함
  * 쏟아지는 다양한 살인 예고, 허위 신고에 모두 대처하기 힘듦
  * 사고 발생시, 즉각적인 대처가 쉽지 않고 대형 인명 피해로 빠르게 번질 수 있음

## 목표

<img width="450" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/92def7f1-e9d0-49ed-994a-aa44d689da09"> <br />

  * Object Detection을 활용한 칼부림 사건 예방
  * 실시간 동영상, CCTV 등을 활용한 빠른 사고 위험 감지
  * 적은 인력과 비용을 통한 효율적인 사고 예방 솔루션
  * 즉각적인 자동 경보 또는 신고 등을 통한 대형 인명 피해 방지

## 데이터셋

<img width="600" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/817f2668-7ce3-4975-9426-52b77bd4532b"> <br />

### 10 Classes / 10K Images

  1. ```흉기로 분류되는 물체``` 총기, 칼
  2. ```흉기가 될 수 있는 물체``` 망치, 도끼
  3. ```흉기로 분류되지 않는 물체``` 스마트폰, 캔, 플라스틱 병, 지갑, 카드, 우산

## 모델 학습 (Fine-tuning)

<img width="600" alt="image" src="https://blog.roboflow.com/content/images/size/w1000/2023/01/image-16.png"> <br />

### YOLOv8
> YOLO의 가장 최신 버전이며, 2023년 1월 Ultralytics에서 개발되었다. YOLO 모델을 위한 완전히 새로운 리포지토리를 출시하여 개체 감지, 인스턴스 세분화 및 이미지 분류 모델을 train하기 위한 통합 프레임워크로 구축되었다.
YOLOv8은 COCO에서 50.2의 mAP를 달성하였고 다양한 작업별 domain들에서 YOLOv8은 YOLOv5보다 높은 성능을 보여주었다. 이번 프로젝트에서는 YOLOv8의 여러 세부 버전 중 small 버전인 YOLOv8s를 Fine-tuning 하였다.

### YOLOv8s

* 225 layers
* 11,139,470 parameters
* 28.7 GFLOPS

## Data Augmentation

<img width="400" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/a1612095-3d90-4f13-97c0-3a1dc2cd4190"> <br />

  * ```Grayscale``` 25% of images
  * ```Blur``` up to 2.5 px
  * ```Noise``` Up to 5% of pixels
  * ```Mosaic```
  > training data => 8980개에서 25653개로 증강

## Hyperparameter

* ```image size``` 640*640
* ```batch size``` 32
* ```epochs``` 200
* ```optimizer``` SGD
* ```momentum``` 0.937
* ```learning rate``` 0.01
* ```label smoothing``` 0.05

## 학습 결과

<img width="650" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/69262c04-f9e6-41e4-8286-a2fc4d078dd8"> <br />

### Validation Set 기준

* ```mAP50``` 0.984
* ```mAP50-95``` 0.898
* ```Speed``` 19.8ms per image

## 영상 적용 결과

> 모델 학습에 사용하지 않은 유튜브 영상 예시

### 흉기로 분류되는 물체 (총기, 칼)

![그림2](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/6caa22e2-596c-450f-be59-472355fdbd33)

![그림3](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/a93396ca-b0f9-4a2c-bb67-9258c86d1887)

![그림4](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/5421823c-5a9a-4842-98b6-60052e09e71d)

### 흉기가 될 수 있는 물체 (도끼, 망치)

![그림5](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/1746437f-9f15-448e-994e-b266f42b5597)

![그림6](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/2548087e-ee93-4704-8e40-13adead4992e)

### 흉기로 분류되지 않는 물체 (스마트폰, 캔, 플라스틱 병)

![그림7](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/53acd82c-8f30-4d82-943b-2c5f8768a751)

![그림8](https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/655ea013-7628-4630-8472-160f8d4e87c0)

## 활용 가능한 어플리케이션 개발

[바로가기](https://ai-weapon-detection.netlify.app/)

### 메인 화면
<img width="600" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/e3b6ed88-ac96-4621-83c9-b2294d4e6cbc"> <br />

> 메인 화면에서 본 프로젝트의 모델을 불러오고, 캠 또는 카메라를 연결할 수 있다.

### 위험하지 않은 물체 탐지 (카드)
<img width="600" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/d2189c0d-34d5-4ca0-ac30-16e8c66a78c1"> <br />

> 카드와 같이 위험하지 않은 물체가 탐지되었을 때, 아무런 일이 일어나지 않는다. (캔버스에 프레임별로 bounding box를 직접 그림)

### 위험한 물체 탐지 (칼)
<img width="600" alt="image" src="https://github.com/DaeHee99/AI-WeaponDetection/assets/100769596/4a4d9347-4eec-4b36-850a-38016f57aeff"> <br />

> 칼과 같이 위험한 물체가 탐지되었을 때, 즉시 빨간 화면으로 바뀌고 경고음이 울린다. 또한 오른쪽 상단의 알림을 통해 어떤 물체가 탐지되어 경보가 울렸는 지 확인할 수 있다.

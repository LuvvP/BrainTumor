from tensorflow.keras.models import load_model
import os
import glob
import nibabel as nib
import numpy as np


model = load_model(r'C:\Users\jizer\OneDrive\Máy tính\ReadNifti\BraTs2020.h5')

path = r'C:\Users\jizer\OneDrive\Máy tính\MICCAI_BraTS2020_TrainingData\MICCAI_BraTS2020_TrainingData\BraTS20_Training_002'

Input_Data = []

def Data_Preprocessing(modalities_dir):
    all_modalities = []    
    for modality in modalities_dir:      
        nifti_file   = nib.load(modality)
        brain_numpy  = np.asarray(nifti_file.dataobj)    
        all_modalities.append(brain_numpy)
    brain_affine   = nifti_file.affine
    all_modalities = np.array(all_modalities)
    all_modalities = np.rint(all_modalities).astype(np.int16)
    all_modalities = all_modalities[:, :, :, :]
    all_modalities = np.transpose(all_modalities)
    return all_modalities

flair     = glob.glob(os.path.join(path, '*_flair*.nii.gz'))
t1        = glob.glob(os.path.join(path, '*_t1*.nii.gz'))
t1ce      = glob.glob(os.path.join(path, '*_t1ce*.nii.gz'))
t2        = glob.glob(os.path.join(path, '*_t2*.nii.gz'))
gt        = glob.glob(os.path.join(path, '*_seg*.nii.gz'))
print(flair[0])
print(t1)
print(t2)
print(t1ce)

modalities_dir = [flair[0], t1[0], t1ce[0], t2[0], gt[0]]
P_Data = Data_Preprocessing(modalities_dir)
Input_Data.append(P_Data)
print(len(Input_Data))
AIO = Input_Data[0]
AIO = np.array(AIO, dtype='float32')
TR = np.array(AIO[:,:,:,1], dtype='float32')
TRL = np.array(AIO[:,:,:,4], dtype='float32')

pref_Tumor = model.predict(TR)
import nibabel as nib
import numpy as np

# Lấy số lượng ảnh trong pref_Tumor
num_images = pref_Tumor.shape[0]

# Tạo một 3D numpy array để lưu trữ tất cả các ảnh
all_images = np.zeros((pref_Tumor.shape[1], pref_Tumor.shape[2], num_images))

# Lặp qua các ảnh và lưu trữ chúng vào all_images
for i in range(num_images):
    all_images[:, :, i] = pref_Tumor[i,:,:,0]

# Tạo một NIFTI image
img = nib.Nifti1Image(all_images, affine=np.eye(4))

# Lưu file NIFTI
nib.save(img, 'pref_Tumor2.nii.gz')
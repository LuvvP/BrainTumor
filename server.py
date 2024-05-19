from flask import Flask, request, jsonify, send_file
import os
from flask_cors import CORS
from tensorflow.keras.models import load_model
import nibabel as nib
import numpy as np
import time 

app = Flask(__name__)
CORS(app)
uploads_dir = os.path.join(app.root_path, 'uploads')
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

Input_Data = []

@app.route('/upload', methods=['POST'])
def upload_folder():
    if 'files[]' not in request.files:
        return jsonify({'message': 'Không tìm thấy tệp tin'}), 400
    
    files = request.files.getlist('files[]')
    modalities_dir = {'flair': None, 't1': None, 't1ce': None, 't2': None, 'gt': None}

    if not files:
        return jsonify({'message': 'Không tìm thấy tệp tin'}), 400

    for file in files:
        filename = file.filename
        folder_name, file_name = os.path.split(filename)
        upload_dir = os.path.join("C:\\Users\\jizer\\OneDrive\\Máy tính\\ReadNifti\\uploads", folder_name)
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_path = os.path.join(uploads_dir, filename)
        file.save(file_path)
        filename = file.filename
        if '_flair.nii.gz' in filename:
            modalities_dir['flair'] = filename
        elif '_t1.nii.gz' in filename:
            modalities_dir['t1'] = filename
        elif '_t1ce.nii.gz' in filename:
            modalities_dir['t1ce'] = filename
        elif '_t2.nii.gz' in filename:
            modalities_dir['t2'] = filename
        elif '_seg.nii.gz' in filename:
            modalities_dir['gt'] = filename

    modalities_dir = [os.path.join("C:\\Users\\jizer\\OneDrive\\Máy tính\\ReadNifti\\uploads", modality) for modality in modalities_dir.values()]
    P_Data = Data_Preprocessing(modalities_dir)
    run_model(P_Data)

    # Trả về tệp nifti đã được xử lý
    print('pref_Tumor.nii.gz')
    time.sleep(10)
    print('Gửi')
    return send_file('pref_Tumor.nii.gz', as_attachment=True)

def run_model(P_Data):
    model = load_model(r'C:\Users\jizer\OneDrive\Máy tính\ReadNifti\BraTs2020.h5')
    AIO = np.array(P_Data, dtype='float32')
    TR = np.array(AIO[:,:,:,1], dtype='float32')
    TRL = np.array(AIO[:,:,:,4], dtype='float32')
    pref_Tumor = model.predict(TR)
    num_images = pref_Tumor.shape[0]
    all_images = np.zeros((pref_Tumor.shape[1], pref_Tumor.shape[2], num_images))

    for i in range(num_images):
        all_images[:, :, i] = pref_Tumor[i,:,:,0]

    img = nib.Nifti1Image(all_images, affine=np.eye(4))
    nib.save(img, 'pref_Tumor.nii.gz')

def Data_Preprocessing(modalities_dir):
    all_modalities = []    
    for modality in modalities_dir:      
        nifti_file   = nib.load(modality)
        brain_numpy  = np.asarray(nifti_file.dataobj)    
        all_modalities.append(brain_numpy)
    all_modalities = np.array(all_modalities)
    all_modalities = np.rint(all_modalities).astype(np.int16)
    all_modalities = all_modalities[:, :, :, :]
    all_modalities = np.transpose(all_modalities)
    return all_modalities

if __name__ == '__main__':
    app.run(debug=True)

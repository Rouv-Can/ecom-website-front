import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent {

  productForm: FormGroup;
  listOfCategories: any = [];
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ){}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.getAllCategories();
  }

  getAllCategories(){
    this.adminService.getAllCategories().subscribe(res=>{
      this.listOfCategories = res;
    })
  }

  addProduct(): void {
  if (this.productForm.invalid) {
    for (const key in this.productForm.controls) {
      this.productForm.controls[key].markAsDirty();
      this.productForm.controls[key].updateValueAndValidity();
    }
    return;
  }

  if (!this.selectedFile) {
    this.snackBar.open('Please select an image.', 'Close', { duration: 3000 });
    return;
  }

  const formData = new FormData();
  formData.append('img', this.selectedFile); // name MUST be 'img' to match DTO
  formData.append('categoryId', String(this.productForm.get('categoryId')!.value));
  formData.append('name', this.productForm.get('name')!.value);
  formData.append('description', this.productForm.get('description')!.value);
  formData.append('price', String(this.productForm.get('price')!.value));

  this.adminService.addProduct(formData).subscribe(
    (res) => {
      if (res?.id != null) {
        this.snackBar.open('Product Posted Successfully!', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.snackBar.open(res?.message || 'Unexpected response', 'ERROR', { duration: 5000 });
      }
    },
    () => this.snackBar.open('Upload failed (check auth or payload).', 'ERROR', { duration: 5000 })
  );
}

}

<script lang="ts">
  
  import { onMount } from "svelte";
  
  import ReviewCard from "$lib/ui/ReviewCard.svelte";
  
  import { placemarkService } from "$lib/services/placemark-service";
  
  import { page } from "$app/state";
  
  const id = page.params.id;
  
  let placemark = $state<any>(null);
    
    let error = $state("");
    
    let selectedFiles: File[] = [];
    
    let uploadError = $state("");
    
    // add review
    
    let reviewName = $state("");
    
    let reviewText = $state("");
    
    let reviewStars = $state(5);
    
    // edit review
    
    let editingReviewIndex = $state<number | null>(null);
      
      let editedReviewName = $state("");
      
      let editedReviewText = $state("");
      
      let editedReviewStars = $state(5);
      
      function handleFiles(e) {
        
        selectedFiles = Array.from(e.target.files);
      }
      
      onMount(() => {
        
        loadPlacemark();
      });
      
      async function loadPlacemark() {
        
        try {
          
          const data = await placemarkService.getPlacemark(id);
          
          placemark = structuredClone(data);
          
        } catch (err) {
          
          console.log("LOAD ERROR:", err);
          
          error = "Server error";
        }
      }
      
      async function uploadImages() {
        
        uploadError = "";
        
        if (!selectedFiles.length) {
          
          uploadError = "Please select images";
          
          return;
        }
        
        const fd = new FormData();
        
        selectedFiles.forEach((file) => {
          
          fd.append("imagefiles", file);
        });
        
        fd.append("reviewer", reviewName);
        
        fd.append("review", reviewText);
        
        fd.append("rating", reviewStars);
        
        try {
          
          await placemarkService.uploadImages(id, fd);
          
          selectedFiles = [];
          
          reviewName = "";
          
          reviewText = "";
          
          reviewStars = 5;
          
          await loadPlacemark();
          
        } catch (err) {
          
          console.log("UPLOAD ERROR:", err);
          
          uploadError = "Server error";
        }
      }
      
      function startReviewEdit(index) {
        
        editingReviewIndex = index;
        
        editedReviewName =
        placemark.reviews?.[index]?.name || "";
        
        editedReviewText =
        placemark.reviews?.[index]?.text || "";
        
        editedReviewStars =
        placemark.reviews?.[index]?.rating || 5;
      }
      
      async function saveReview(index) {
        
        try {
          
          await placemarkService.saveReview(
          id,
          index,
          {
            name: editedReviewName,
            text: editedReviewText,
            rating: editedReviewStars
          }
          );
          
          editingReviewIndex = null;
          
          await loadPlacemark();
          
        } catch (err) {
          
          console.log("SAVE REVIEW ERROR:", err);
        }
      }
      
      async function deleteReview(index) {
        
        try {
          
          await placemarkService.deleteReview(
          id,
          index
          );
          
          await loadPlacemark();
          
        } catch (err) {
          
          console.log("DELETE REVIEW ERROR:", err);
        }
      }
      
    </script>
    
    <section class="section">
      
      <div class="container">
        
        {#if error}
        <div class="notification is-danger">
          {error}
        </div>
        {/if}
        
        {#if placemark}
        
        <h1 class="title">
          {placemark.name}
        </h1>
        
        <p class="mb-4">
          {placemark.description}
        </p>
        
        <div class="columns">
          
          <div class="column is-half">
            
            {#if placemark.reviews?.length}
            
            <div class="image-grid">
              
              {#each placemark.reviews as review, index}
              
              <ReviewCard
              {placemark}
              {review}
              {index}
              {editingReviewIndex}
              bind:editedReviewName
              bind:editedReviewText
              bind:editedReviewStars
              {startReviewEdit}
              {saveReview}
              {deleteReview}
              />
              
              {/each}
              
            </div>
            
            {:else if placemark.img}
            
            <div class="image-tile">
              
              <img
              src={placemark.img}
              alt={placemark.name}
              class="gallery-image"
              />
              
            </div>
            
            {/if}
            
          </div>
          
          <div class="column is-half">
            
            <div class="box">
              
              <p><strong>Category:</strong> {placemark.category}</p>
              
              <p><strong>County:</strong> {placemark.county}</p>
              
              <p><strong>Year:</strong> {placemark.yearEstablished}</p>
              
              <p><strong>Latitude:</strong> {placemark.latitude}</p>
              
              <p><strong>Longitude:</strong> {placemark.longitude}</p>
              
            </div>
            
            <div class="box mt-5">
              
              <h2 class="title is-5">
                Upload More Images
              </h2>
              
              {#if uploadError}
              <div class="notification is-danger">
                {uploadError}
              </div>
              {/if}
              
              <input
              type="file"
              multiple
              onchange={handleFiles}
              />
              
              <input
              class="input mt-3"
              placeholder="Your name"
              bind:value={reviewName}
              />
              
              <textarea
              class="textarea mt-3"
              placeholder="Leave a review"
              bind:value={reviewText}
              ></textarea>
              
              <div class="select mt-3">
                
                <select bind:value={reviewStars}>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                
              </div>
              
              <button
              class="button is-primary mt-4"
              onclick={uploadImages}
              >
              Upload Images
            </button>
            
          </div>
          
        </div>
        
      </div>
      
      {/if}
      
    </div>
    
  </section>
  
  <style>
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .image-tile {
      display: flex;
      flex-direction: column;
    }
    
    .gallery-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 12px 12px 0 0;
      transition: transform 0.3s ease;
    }
    
    .gallery-image:hover {
      transform: scale(1.02);
    }
    
  </style>
/**
 * Three-Quarter Angle Prompt Builder
 *
 * Generates narrative, perspective-focused prompts to produce a 3/4 angle
 * photograph of the same room shown in a head-on reference image.
 * Uses Google's recommended narrative style over bullet-point lists to
 * maximize the model's language understanding and prevent it from
 * anchoring too heavily on the frontal reference composition.
 */

/**
 * Build the 3/4 angle prompt for wall art scenes
 */
function buildWallArtThreeQuarterPrompt(): string {
  return `
A photorealistic 3/4 perspective interior photograph of the exact same room shown in the reference image. The photographer has moved to a relaxed, flattering 45-degree angle (to the left or right), capturing a natural lifestyle shot at eye level with a 35mm lens. 

Wall lines and floor planks converge naturally toward a vanishing point off-center. The sofa beautifully reveals its arm and side profile, and the wall art appears properly foreshortened in 3D space. Do not push the camera into an extreme corner or use an aggressive wide-angle lens. The perspective shift should feel elegant, inviting, and strictly adhere to a moderate 45-degree rotation, avoiding any distorted "real estate" corner-shot look.

The wall art must remain small — a delicate accent piece surrounded by generous negative space on the wall, not an oversized statement piece. It should cast a soft ambient occlusion shadow onto the adjacent wall surface, which becomes even more visible from this oblique angle.

Everything else — the room's furniture, materials, color palette, lighting warmth and direction, and sun-drenched airy atmosphere — should match the reference image naturally. The reference image already encodes the full aesthetic; simply photograph the same bright, beautiful space from the new angle.

REFERENCE IMAGE DECOUPLING:
The provided reference image is strictly a source of stylistic DNA — use it only to extract furniture identity, lighting quality, color palette, and textures. Entirely discard the flat camera angle, orthogonal perspective, and 2D composition of the reference image. Do not inherit or reproduce the reference image's geometry in any way.

MANDATORY PERSPECTIVE WARP:
The wall art MUST NOT face the camera flatly. It must be mathematically mapped onto the receded plane of the angled back wall. Apply accurate foreshortening, perspective skew, and scale recession to the wall art so that its edges converge perfectly with the vanishing points of the room's architecture. If the wall art appears as a flat rectangle facing the viewer, the perspective warp has failed.

3D DEPTH AND EDGE GENERATION:
Generate realistic 3D edge thickness on the wall art — metal returns, rims, or canvas edges must be visible on the side of the product closest to the camera. The wall art must appear as a physical object with weight and volume mounted on the wall, not a paper-thin digital decal pasted onto a flat surface.

ANGLED SHADOW PHYSICS:
Generate accurate ambient occlusion and directional drop-shadows behind the wall art. Shadows must stretch away from the light source and track correctly along the receded 3D perspective plane of the angled wall. The shadow shape must reflect the oblique viewing angle, not a frontal projection.

CAMERA POSITION & ANGLE (CRITICAL):
- This is a natural 45-degree 3/4 perspective viewpoint.
- The camera is positioned moderately to the left or right of the room's center axis, looking inward so the back wall recedes naturally.
- DO NOT use an extreme wide-angle distortion, and DO NOT push the camera deep into a corner. Keep the perspective elegant, relaxed, and grounded.

SCENE COMPOSITION FREEZE (CRITICAL):
- The position of every piece of furniture, rug, lighting fixture, and decor object is STRICTLY LOCKED to its location in the reference image.
- You may NOT move, remove, re-arrange, or add any objects. If there is a coffee table in the reference, it MUST remain in that exact spot.
- The room itself is a frozen statue; your ONLY task is to move the camera around it.
`.trim();
}

/**
 * Build the 3/4 angle prompt for shelf scenes
 */
function buildShelfThreeQuarterPrompt(): string {
  return `
A photorealistic 3/4 perspective interior photograph of the exact same room shown in the reference image. The photographer has moved to a relaxed, flattering 45-degree angle (to the left or right), capturing a natural lifestyle shot at eye level with a 35mm lens. 

Wall lines and floor planks converge naturally toward a vanishing point off-center. The sofa beautifully reveals its arm and side profile, and the shelf appears properly foreshortened in 3D space. Do not push the camera into an extreme corner or use an aggressive wide-angle lens. The perspective shift should feel elegant, inviting, and strictly adhere to a moderate 45-degree rotation, avoiding any distorted "real estate" corner-shot look.

The shelf should cast a soft ambient occlusion shadow onto the adjacent wall surface, which becomes even more visible from this oblique angle.

Everything else — the room's furniture, decorative props, materials, color palette, lighting warmth and direction, and sun-drenched airy atmosphere — should match the reference image naturally. The reference image already encodes the full aesthetic; simply photograph the same bright, beautiful space from the new angle.

REFERENCE IMAGE DECOUPLING:
The provided reference image is strictly a source of stylistic DNA — use it only to extract furniture identity, lighting quality, color palette, and textures. Entirely discard the flat camera angle, orthogonal perspective, and 2D composition of the reference image. Do not inherit or reproduce the reference image's geometry in any way.

MANDATORY PERSPECTIVE WARP:
The shelf MUST NOT face the camera flatly. It must be mathematically mapped onto the receded plane of the angled back wall, showing true depth and convergence with the room's architectural vanishing points. Apply accurate foreshortening, perspective skew, and scale recession so that the shelf recedes along the wall plane. If the shelf appears as a flat horizontal line with no depth, the perspective warp has failed.

3D DEPTH AND EDGE GENERATION:
The shelf must show its full physical depth, bracket mounting or support structure, and side edge on the side closest to the camera. Props on the shelf must reveal their three-dimensional form — they are physical objects with volume, not flat cutouts pasted onto a surface. Generate realistic edge thickness and dimensional detail throughout.

ANGLED SHADOW PHYSICS:
Generate accurate ambient occlusion and directional drop-shadows behind and beneath the shelf. Shadows must stretch away from the light source and track correctly along the receded 3D perspective plane of the angled wall. The shadow shape must reflect the oblique viewing angle, not a frontal projection.

CAMERA POSITION & ANGLE (CRITICAL):
- This is a natural 45-degree 3/4 perspective viewpoint.
- The camera is positioned moderately to the left or right of the room's center axis, looking inward so the back wall recedes naturally.
- DO NOT use an extreme wide-angle distortion, and DO NOT push the camera deep into a corner. Keep the perspective elegant, relaxed, and grounded.

SCENE COMPOSITION FREEZE (CRITICAL):
- The position of every piece of furniture, rug, lighting fixture, and decor object is STRICTLY LOCKED to its location in the reference image.
- You may NOT move, remove, re-arrange, or add any objects. If there is a coffee table in the reference, it MUST remain in that exact spot.
- The room itself is a frozen statue; your ONLY task is to move the camera around it.
`.trim();
}

/**
 * Build the appropriate 3/4 angle prompt based on product type
 */
export function buildThreeQuarterPrompt(productType: "wall-art" | "shelf"): string {
  switch (productType) {
    case "wall-art":
      return buildWallArtThreeQuarterPrompt();
    case "shelf":
      return buildShelfThreeQuarterPrompt();
    default:
      throw new Error(`Unknown product type: ${productType}`);
  }
}

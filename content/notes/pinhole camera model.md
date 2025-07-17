
<div class="container" style="display: flex; justify-content: center; align-items: center;">
    <img src="../static/notes/pinhole_model.png" style="max-width: 100%; height: auto;">
</div>

>[!NOTE] The basic pinhole model
>
>We consider the central projection of points in space onto a plane. Let the centre of projection be the origin of a Euclidean coordinate system, and consider the plane $Z = f$, which is called the _image plane_ or _focal plane_. Under the pinhole camera model, a point in space with coordinates $X = (X, Y, Z)^T$ is mapped to the point on the image plane where a line joining the point X to the centre of projection meets the image plane.
>
>By similar triangles, one quickly computes that the point $(X, Y, Z)^T$ is mapped to the point $(fX/Z,fY/Z,f)^T$ on the image plane. Ignoring the final image coordinate, we see that
>$$
>(X,Y,Z)^T \mapsto (fX/Z, fY/Z)
>$$
>
>describes the central projection mapping from world to image coordinates. This is a mapping from Euclidean 3-space $R^3$ to Euclidean 2-space $R^2$.

import argparse

# That's an impressive list of imports.
import numpy as np
from numpy import linalg
from numpy.linalg import norm
from scipy.spatial.distance import squareform, pdist
import pandas as pd

# We import sklearn.
import sklearn
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits
from sklearn.preprocessing import scale

# We'll hack a bit with the t-SNE code in sklearn 0.15.2.
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.manifold.t_sne import (_joint_probabilities,
                                    _kl_divergence)
from sklearn.utils.extmath import _ravel

# We'll use matplotlib for graphics.
import matplotlib.pyplot as plt
import matplotlib.patheffects as PathEffects
import matplotlib

# We import seaborn to make nice plots.
import seaborn as sns
sns.set_style('darkgrid')
sns.set_palette('muted')
sns.set_context("notebook", font_scale=1.5,
                rc={"lines.linewidth": 2.5})

# We'll generate an animation with matplotlib and moviepy.
from moviepy.video.io.bindings import mplfig_to_npimage
import moviepy.editor as mpy

# Random state.
RS = 20150101
DEBUG = False


def scatter(x):
    # We choose a color palette with seaborn.
    palette = np.array(sns.color_palette("hls", 10))

    # We create a scatter plot.
    f = plt.figure(figsize=(8, 8))
    ax = plt.subplot(aspect='equal')
    sc = ax.scatter(x[:, 0], x[:, 1], lw=0, s=40)
    plt.xlim(-25, 25)
    plt.ylim(-25, 25)
    ax.axis('off')
    ax.axis('tight')

    return f, ax, sc


def _gradient_descent(objective, p0, it, n_iter, n_iter_without_progress=30,
                      momentum=0.5, learning_rate=1000.0, min_gain=0.01,
                      min_grad_norm=1e-7, min_error_diff=1e-7, verbose=0,
                      args=[]):
    # The documentation of this function can be found in scikit-learn's code.
    p = p0.copy().ravel()
    update = np.zeros_like(p)
    gains = np.ones_like(p)
    error = np.finfo(np.float).max
    best_error = np.finfo(np.float).max
    best_iter = 0

    for i in range(it, n_iter):
        # We save the current position.
        positions.append(p.copy())

        new_error, grad = objective(p, *args)
        error_diff = np.abs(new_error - error)
        error = new_error
        grad_norm = linalg.norm(grad)

        if error < best_error:
            best_error = error
            best_iter = i
        elif i - best_iter > n_iter_without_progress:
            break
        if min_grad_norm >= grad_norm:
            break
        if min_error_diff >= error_diff:
            break

        inc = update * grad >= 0.0
        dec = np.invert(inc)
        gains[inc] += 0.05
        gains[dec] *= 0.95
        np.clip(gains, min_gain, np.inf)
        grad *= gains
        update = momentum * update - learning_rate * grad
        p += update

    return p, error, i


def make_frame_mpl(t):
    i = int(t * 40)
    x = X_iter[..., i]
    sc.set_offsets(x)
    return mplfig_to_npimage(f)


def _parse_file_argument():
    parser = argparse.ArgumentParser("t-SNE commandline tool")
    parser.add_argument('--csv_file',
                        help='input csv filename')
    parser.add_argument('--label',
                        help='column name with label')
    args = parser.parse_args()
    return args


def _read_input_string(args):
    graph_file = args.graph_file
    graph_string = graph_file.readline().strip('\n')
    graph_file.close()
    return graph_string


if __name__ == '__main__':
    # parsing input data
    args = _parse_file_argument()
    input_data = pd.read_csv(args.csv_file)

    # treating missing data
    input_data.fillna(0, inplace=True)

    # treating label column
    label_column = args.label
    labels = input_data[label_column].values
    input_data.drop(label_column, axis=1, inplace=True)
    features = input_data.columns.values

    # Important part ;)
    tsne_proj = TSNE(random_state=RS).fit_transform(input_data)

    # Save projecton as csv
    df = pd.DataFrame(index=labels, data=tsne_proj, columns=['x', 'y'])
    df.to_csv('data/tsne.csv', index_label='label')

    # 2d visualization
    scatter(tsne_proj)
    plt.savefig('images/tsne.png', dpi=120)

    # Monkey patch in order to track model evolution
    sklearn.manifold.t_sne._gradient_descent = _gradient_descent
    # Positions of the map points at every iteration.
    positions = []
    X_proj = TSNE(random_state=RS).fit_transform(tsne_proj)
    X_iter = np.dstack(position.reshape(-1, 2) for position in positions)
    f, ax, sc = scatter(X_iter[..., -1])
    animation = mpy.VideoClip(make_frame_mpl, duration=X_iter.shape[2] / 40.)
    animation.write_gif("images/tsne.gif", fps=20)

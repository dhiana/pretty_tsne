# pretty\_tsne
Based on https://www.oreilly.com/learning/an-illustrated-introduction-to-the-t-sne-algorithm

## Getting Started

Install packages:

    $ pip install -r requirements.txt

Run command:

    $ python pretty_tsne.py --csv_file <csv_file> --label <label_column_name>

An image of t-SNE projection will be generated under images folder,
together with a gif animation of the projections during the model
evolution.

Also, a csv with projected data and labels (if available) will be
generated under data folder.

Finaly, to view an interactive (labels on hover) t-SNE plot:

    $ python -m SimpleHTTPServer 8000

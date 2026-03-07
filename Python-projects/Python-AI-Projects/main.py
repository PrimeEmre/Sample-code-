#Iris Flower Classifier
# from sklearn.datasets import load_iris
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import accuracy_score
# import numpy as np

# # loding data
# iris = load_iris()
# x = iris.data
# y = iris.target

# # training the AI
# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# model = DecisionTreeClassifier()
# model.fit(X_train, y_train)
# predictions = model.predict(X_test)
# print(f"Accuracy: {accuracy_score(y_test, predictions) * 100:.2f}%")

# # predicting new flower
# new_flower = np.array([[1.2, 4.6, 1.1, 7.5]])
# prediction = model.predict(new_flower)
# print(f"Predicted species: {iris.target_names[prediction][0]}")


# Titanic Survival Prediction
# setting the modules
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import accuracy_score

# #  setting the dataset & Load the dataset
# dataset = pd.read_csv("train.csv")

# # Setting the data and cleaning the data
# dataset["Age"].fillna(dataset["Age"].median(), inplace=True)
# dataset.drop(columns=["Cabin"], inplace=True)
# dataset.dropna(subset=["Embarked"], inplace=True)
# dataset["Sex"] = dataset["Sex"].map({"male": 0, "female": 1})
# dataset["Embarked"] = dataset["Embarked"].map({"S": 0, "C": 1, "Q": 2})

# # Setting the futures
# features = ["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked"]
# x_axis = dataset[features]
# y_axis = dataset["Survived"]

# # Truing the modules
# X_train, X_test, y_train, y_test = train_test_split(x_axis, y_axis, test_size=0.2, random_state=42
#                                                     )
# model = DecisionTreeClassifier()
# model.fit(X_train, y_train)

# # Checking the accuracy & setting the prediction
# predictions = model.predict(X_test)
# print(f"Accuracy score: {accuracy_score(y_test, predictions) * 100}%")

# new_passanger = np.array([[3, 1, 22, 1, 1, 7.25, 0]])
# prediction = model.predict(new_passanger)
# if prediction[0] == 1:
#     print("This passenger would have survived ")
# else:
#     print("This passenger would NOT survived ")


# # House Price Prediction
# import pandas as pd
# from xgboost import XGBRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_absolute_error, r2_score
# import joblib

# # Setting the Data
# data = pd.read_csv('train.csv')

# print(f"Data loaded: {data.shape}")

# # Setting the values and colums
# num_cols = data.select_dtypes(include='number').columns
# data[num_cols] = data[num_cols].fillna(data[num_cols].median())
# cat_cols = data.select_dtypes(include='str').columns
# data[cat_cols] = data[cat_cols].fillna(data[cat_cols].mode().iloc[0])

# data = pd.get_dummies(data , drop_first=True)

# # Setting the x and y-axis for our data
# x_axis = data.drop("SalePrice", axis=1)
# y_axis = data["SalePrice"]
# X_train, X_test, y_train, y_test = train_test_split(x_axis, y_axis, test_size=0.2, random_state=42)

# # training our AI
# model = XGBRegressor(n_estimators=500, learning_rate=0.05, max_depth=6, random_state=42)
# model.fit(X_train, y_train)

# # Agglutinating the house prices
# y_pred = model.predict(X_test)
# print(f"MAE: ${mean_absolute_error(y_test, y_pred)}:,0f")
# print(f"R²:   {r2_score(y_test, y_pred):.4f}")
# # Predicting the house prices
# sample = X_test.iloc[0:1]
# predicting_price = model.predict(sample)
# print(f"Predicting price: ${predicting_price[0]:,.0f}")

# # Creating the custom prices
# custom_house = X_test.iloc[0:1].copy()
# custom_house['GrLivArea'] = 12000
# custom_house['OverallQual'] = 10
# custom_house['TotRmsAbvGrd'] = 12
# custom_house['YearBuilt'] = 2024
# custom_house['GarageCars'] = 3
# price = model.predict(custom_house)
# print(f"Your House Predicted Price: ${price[0]:,.0f}")

# # See first 5 predictions vs actual prices
# for i in range(10):
#     sample = X_test.iloc[i:i+1]
#     pred = model.predict(sample)[0]
#     actual = y_test.iloc[i]
#     print(f"House {i+1} → Predicted: ${pred:,.0f}  |  Actual: ${actual:,.0f}")

# # Saving the model
# joblib.dump(model, 'house_price_model.pkl')
# print("Model saved!")


# Movie Remonder Program
# import requests
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# # Setting the API
# API_KEY = "your api"
# BASE_URL = "your url"
# # Setting the data
# movies = pd.read_csv("movie.csv")
# print(f"movies loaded: {movies.shape}")

# # Setting the volum for the movies
# movies['genres'] = movies['genres'].fillna('')

# # Converting gnereas to numbers
# trfidf = TfidfVectorizer(stop_words='english')
# trfidf_martix = trfidf.fit_transform(movies['genres'])

# # Calculating teh similarity of the movies
# similarity = cosine_similarity(trfidf_martix, trfidf_martix)
# print("Similarity matrix created!")
# # Building the recommendation
# def search_movie(movie_title):
#     url = f"{BASE_URL}/search/movie"
#     params = {"api_key": API_KEY, "query": movie_title}
#     response = requests.get(url, params=params)
#     results = response.json().get("results", [])

#     if not results:
#         print(f"Movie '{movie_title}' not found!")
#         return None

#     movie = results[0]
#     print(f"Found: {movie['title']} ({movie.get('release_date', 'N/A')[:4]})")
#     return movie

# # Step 2: Get recommendations
# def recommend(movie_title, num_recommendations=5):
#     movie = search_movie(movie_title)
#     if not movie:
#         return

#     movie_id = movie["id"]

#     url = f"{BASE_URL}/movie/{movie_id}/recommendations"
#     params = {"api_key": API_KEY}
#     response = requests.get(url, params=params)
#     results = response.json().get("results", [])

#     if not results:
#         print(f"No recommendations found for '{movie_title}'")
#         return

#     print(f"\n Because you liked '{movie_title}', we recommend:")
#     for i, m in enumerate(results[:num_recommendations], 1):
#         year = m.get("release_date", "N/A")[:4]
#         rating = m.get("vote_average", "N/A")
#         print(f"  {i}. {m['title']} ({year}) ⭐ {rating}/10")

# # Step 3: Test it!
# recommend("Toy Story")
# recommend("The Dark Knight")
# recommend("Parasite")
# recommend("Inception")
# recommend("Recep Ivedik ")

# LLM Moudle 
import torch
import torch.nn as nn
import torch.nn.functional as F
from dataclasses import dataclass
import time
import sys


# ── Configuration optimized for RTX 3060 12GB ──────────────────
@dataclass
class Config:
    # Data
    data_file: str = "input.txt"

    # Model architecture - optimized for 12GB VRAM
    block_size: int = 512  # Increased context length
    vocab_size: int = None
    embed_size: int = 512  # Increased for better quality
    num_heads: int = 8
    num_layers: int = 8
    dropout: float = 0.1

    # Training
    batch_size: int = 64  # Can increase with 12GB
    learning_rate: float = 3e-4
    epochs: int = 10000  # More epochs for better training
    train_split: float = 0.9

    # Device - Force CUDA
    device: str = "cuda" if torch.cuda.is_available() else "cpu"

    def __post_init__(self):
        print("=" * 60)
        print(f"RTX 3060 12GB OPTIMIZED CONFIGURATION")
        print("=" * 60)

        if self.device == "cuda":
            print(f"✓ Using GPU: {torch.cuda.get_device_name(0)}")
            print(f"✓ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024 ** 3:.2f} GB")
            print(f"✓ CUDA Version: {torch.version.cuda}")
        else:
            print("✗ CUDA not available, using CPU")

        print(f"✓ Model parameters:")
        print(f"  - Block size: {self.block_size}")
        print(f"  - Embed size: {self.embed_size}")
        print(f"  - Layers: {self.num_layers}")
        print(f"  - Heads: {self.num_heads}")
        print(f"  - Batch size: {self.batch_size}")
        print("=" * 60)


# ── Model Components ───────────────────────────────────────────
class Head(nn.Module):
    def __init__(self, embed_size, head_size, block_size, dropout):
        super().__init__()
        self.query = nn.Linear(embed_size, head_size, bias=False)
        self.key = nn.Linear(embed_size, head_size, bias=False)
        self.value = nn.Linear(embed_size, head_size, bias=False)
        self.register_buffer("tril", torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        q = self.query(x)
        k = self.key(x)
        scores = q @ k.transpose(-2, -1) * (C ** -0.5)
        scores = scores.masked_fill(self.tril[:T, :T] == 0, float("-inf"))
        weights = F.softmax(scores, dim=-1)
        weights = self.dropout(weights)
        v = self.value(x)
        return weights @ v


class MultiHeadAttention(nn.Module):
    def __init__(self, embed_size, num_heads, block_size, dropout):
        super().__init__()
        head_size = embed_size // num_heads
        self.heads = nn.ModuleList([
            Head(embed_size, head_size, block_size, dropout)
            for _ in range(num_heads)
        ])
        self.proj = nn.Linear(embed_size, embed_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        return self.dropout(self.proj(out))


class FeedForward(nn.Module):
    def __init__(self, embed_size, dropout):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(embed_size, 4 * embed_size),
            nn.GELU(),  # Better than ReLU
            nn.Linear(4 * embed_size, embed_size),
            nn.Dropout(dropout)
        )

    def forward(self, x):
        return self.net(x)


class TransformerBlock(nn.Module):
    def __init__(self, embed_size, num_heads, block_size, dropout):
        super().__init__()
        self.norm1 = nn.LayerNorm(embed_size)
        self.attention = MultiHeadAttention(embed_size, num_heads, block_size, dropout)
        self.norm2 = nn.LayerNorm(embed_size)
        self.ff = FeedForward(embed_size, dropout)

    def forward(self, x):
        x = x + self.attention(self.norm1(x))
        x = x + self.ff(self.norm2(x))
        return x


class MiniGPT(nn.Module):
    def __init__(self, config: Config):
        super().__init__()
        self.config = config

        block_size = config.block_size
        embed_size = config.embed_size
        num_heads = config.num_heads
        num_layers = config.num_layers
        vocab_size = config.vocab_size
        dropout = config.dropout

        self.token_embedding = nn.Embedding(vocab_size, embed_size)
        self.position_embedding = nn.Embedding(block_size, embed_size)

        self.blocks = nn.Sequential(*[
            TransformerBlock(embed_size, num_heads, block_size, dropout)
            for _ in range(num_layers)
        ])

        self.norm = nn.LayerNorm(embed_size)
        self.output_head = nn.Linear(embed_size, vocab_size)

        # Initialize weights
        self.apply(self._init_weights)

        # Move to GPU
        self.to(config.device)

        # Count parameters
        n_params = sum(p.numel() for p in self.parameters())
        print(f"✓ Model created with {n_params:,} parameters")
        print(f"✓ Estimated VRAM usage: {n_params * 4 / 1024 ** 3:.2f} GB (parameters)")

    def _init_weights(self, module):
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)

    def forward(self, x, targets=None):
        B, T = x.shape
        token_emb = self.token_embedding(x)
        pos_emb = self.position_embedding(torch.arange(T, device=x.device))
        x = token_emb + pos_emb
        x = self.blocks(x)
        x = self.norm(x)
        logits = self.output_head(x)

        loss = None
        if targets is not None:
            B, T, C = logits.shape
            loss = F.cross_entropy(logits.view(B * T, C), targets.view(B * T))

        return logits, loss

    @torch.no_grad()
    def generate(self, x, max_new_tokens=500, temperature=1.0, top_k=None):
        for _ in range(max_new_tokens):
            x_cropped = x[:, -self.config.block_size:]
            logits, _ = self(x_cropped)
            logits = logits[:, -1, :] / temperature

            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float('Inf')

            probs = F.softmax(logits, dim=-1)
            next_char = torch.multinomial(probs, num_samples=1)
            x = torch.cat([x, next_char], dim=1)
        return x


# ── Main Training Function ─────────────────────────────────────
def main():
    # Initialize configuration
    config = Config()

    # Load data
    print("\n[1/4] Loading data...")
    try:
        with open(config.data_file, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print(f"✗ Error: File '{config.data_file}' not found!")
        print("  Create a file named 'input.txt' with your training text.")
        return

    print(f"✓ Loaded {len(text):,} characters")

    # Create vocabulary
    chars = sorted(set(text))
    vocab_size = len(chars)
    config.vocab_size = vocab_size

    print(f"✓ Vocabulary size: {vocab_size}")
    print(f"  Characters: {''.join(chars[:50])}..." if len(chars) > 50 else f"  Characters: {''.join(chars)}")

    # Create mappings
    stoi = {ch: i for i, ch in enumerate(chars)}
    itos = {i: ch for i, ch in enumerate(chars)}

    def encode(s):
        return [stoi[c] for c in s]

    def decode(l):
        return ''.join([itos[i] for i in l])

    # Encode data
    data = torch.tensor(encode(text), dtype=torch.long)

    # Split data
    n = int(config.train_split * len(data))
    train_data = data[:n]
    val_data = data[n:]

    print(f"✓ Train set: {len(train_data):,} tokens")
    print(f"✓ Val set: {len(val_data):,} tokens")

    # Move data to GPU
    if config.device == "cuda":
        train_data = train_data.cuda()
        val_data = val_data.cuda()
        print(f"✓ Data moved to GPU")

    # Create model
    print("\n[2/4] Creating model...")
    model = MiniGPT(config)

    # Create optimizer with weight decay
    optimizer = torch.optim.AdamW(model.parameters(), lr=config.learning_rate, weight_decay=0.01)

    # Learning rate scheduler
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=config.epochs)

    # Training function
    def get_batch(split):
        data = train_data if split == "train" else val_data
        ix = torch.randint(len(data) - config.block_size, (config.batch_size,), device=data.device)
        x = torch.stack([data[i:i + config.block_size] for i in ix])
        y = torch.stack([data[i + 1:i + config.block_size + 1] for i in ix])
        return x, y

    # Train
    print("\n[3/4] Training model...")
    print("=" * 60)

    start_time = time.time()
    best_val_loss = float('inf')

    for step in range(config.epochs):
        # Get batch
        x, y = get_batch("train")

        # Forward pass
        logits, loss = model(x, y)

        # Backward pass
        optimizer.zero_grad()
        loss.backward()

        # Gradient clipping
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)

        optimizer.step()
        scheduler.step()

        # Log progress
        if step % 100 == 0:
            # Validation loss
            model.eval()
            with torch.no_grad():
                val_losses = []
                for _ in range(10):  # Average over 10 batches
                    val_x, val_y = get_batch("val")
                    _, val_loss = model(val_x, val_y)
                    val_losses.append(val_loss.item())
                avg_val_loss = sum(val_losses) / len(val_losses)

                # Save best model
                if avg_val_loss < best_val_loss:
                    best_val_loss = avg_val_loss
                    torch.save(model.state_dict(), "best_model.pt")

            model.train()

            elapsed = time.time() - start_time
            tokens_per_sec = (step + 1) * config.batch_size * config.block_size / elapsed

            # GPU memory info
            if config.device == "cuda":
                mem_alloc = torch.cuda.memory_allocated() / 1024 ** 3
                mem_reserved = torch.cuda.memory_reserved() / 1024 ** 3
                mem_info = f" | GPU: {mem_alloc:.2f}/{mem_reserved:.2f} GB"
            else:
                mem_info = ""

            print(f"Step {step:5d}/{config.epochs} | "
                  f"Train: {loss.item():.4f} | "
                  f"Val: {avg_val_loss:.4f} | "
                  f"Best: {best_val_loss:.4f} | "
                  f"Time: {elapsed:.0f}s | "
                  f"Tokens/s: {tokens_per_sec:.0f}{mem_info}")

    total_time = time.time() - start_time
    print(f"\n✓ Training completed in {total_time:.1f} seconds!")
    print(f"✓ Best validation loss: {best_val_loss:.4f}")

    # Save final model
    print("\n[4/4] Saving model...")
    torch.save({
        'model_state_dict': model.state_dict(),
        'config': config,
        'chars': chars,
        'stoi': stoi,
        'itos': itos,
        'best_val_loss': best_val_loss,
    }, "model_final.pt")
    print("✓ Model saved to 'model_final.pt'")

    # Generate sample text
    print("\n" + "=" * 60)
    print("GENERATING SAMPLE TEXT")
    print("=" * 60)

    model.eval()

    # Create initial context (use a real character from vocabulary)
    context = torch.tensor([[stoi[chars[0]]]], dtype=torch.long, device=config.device)

    # Generate
    with torch.no_grad():
        generated = model.generate(
            context,
            max_new_tokens=500,
            temperature=0.8,
            top_k=40  # Top-k sampling for better quality
        )

    # Decode and print
    output_text = decode(generated[0].cpu().tolist())
    print("\nGenerated text:")
    print("-" * 60)
    print(output_text)
    print("-" * 60)

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print("=" * 60)
    print(f"Total training time: {total_time / 60:.1f} minutes")
    print(f"Final model saved as 'model_final.pt'")
    print(f"Best model saved as 'best_model.pt'")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✗ Training interrupted by user")
        print("Model checkpoint saved as 'best_model.pt'")
    except Exception as e:
        print(f"\n\n✗ Error: {e}")
        import traceback

        traceback.print_exc()